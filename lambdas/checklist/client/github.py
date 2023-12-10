import base64
import json
import requests

from config import Config
from utils.compression import compress_file_content


class GithubClient:
    def __init__(self, github_username):
        self.github_username = github_username

    def get_programming_languages_used(self, repository_name):
        """
        Retrieves programming languages used in a specified GitHub repository.

        :param repository_name: Name of the GitHub repository.
        :return: A list of programming languages used in the repository.
        """
        url = Config.GITHUB_API_REPO_URL + self.github_username + "/" + repository_name + "/languages"
        try:
            res = requests.get(url, headers=Config.GITHUB_REST_API_HEADERS)
        except Exception:
            raise RuntimeError("Error getting programming languages used in repository. Request to GitHub API failed.")
        if res.status_code == 404:
            raise RuntimeError("Error getting programming languages used in repository. Repository not found.")
        data = json.loads(res.content)
        if data == {}:
            raise RuntimeError("Error getting programming languages used in repository. No languages found.")
        return data

    def get_important_file_paths(self, repo_name, important_file_names):
        """
        Fetches URLs of important files from a GitHub repository.

        :param repo_name: Repository name.
        :param important_file_names: A list of important file names to look for.
        :return: A list of file paths for important files in the repository.
        """
        try:
            branch = self._get_default_branch(repo_name)
        except Exception:
            return []

        url = Config.GITHUB_API_REPO_URL + self.github_username + "/" + repo_name + "/git/trees/" + branch + "?recursive=1"
        try:
            res = requests.get(url, headers=Config.GITHUB_REST_API_HEADERS)
        except Exception:
            raise RuntimeError("Error getting file tree. Request to GitHub API failed.")

        data = json.loads(res.content)
        if data is None or data.get('tree') is None:
            raise RuntimeError("Error getting file tree. No tree found.")

        tree = data['tree']
        file_paths = []
        for branch in tree:
            if branch['type'] == 'blob' and self._is_important_file(branch['path'], important_file_names):
                file_paths.append(branch['path'])

        # TODO: If the list is too big, we need to filter out the files that are not important (depth > 2)
        return file_paths

    def get_file_contents(self, repo_name, file_path):
        """
        Retrieves the contents of a file from a GitHub repository.

        :param repository_name: Repository name.
        :param file_path: Path of the file in the repository.
        :return: The content of the file as a string.
        """
        url = Config.GITHUB_API_REPO_URL + self.github_username + "/" + repo_name + "/contents/" + file_path
        try:
            res = requests.get(url, headers=Config.GITHUB_REST_API_HEADERS)
        except Exception:
            raise RuntimeError("Error getting file contents. Request to GitHub API failed.")

        data = json.loads(res.content)
        if data is None or data.get('content') is None:
            return "(No content found)"

        content_encoded = data['content']
        content = str(base64.b64decode(content_encoded))
        return content

    def get_repo_file_content(self, repo_name, languages):
        """
        Retrieves the content of important files from a specified repository.

        :param repo_name: Name of the repository.
        :param languages: A map of programming languages used in the repository, key: name, value: byte.
        :return: A string containing the content of important files from the repository, formatted with repository and file path information.
        """
        important_file_names = GithubClient.get_important_file_names(languages)
        file_paths = self.get_important_file_paths(repo_name, important_file_names)

        content = "repository: " + repo_name + "\n"
        for file_path in file_paths:
            compressed_content = compress_file_content(file_path, self.get_file_contents(repo_name, file_path))
            content += "path: " + file_path + "\n" + compressed_content + "\n"

        return content

    def get_pinned_repositories_name(self):
        """
        Fetches names of pinned repositories for a given GitHub username.

        :param github_username: The GitHub username.
        :return: A list of names of pinned repositories.
        """
        query = """
        {
            repositoryOwner(login: "%s") {
                ... on User {
                    pinnableItems(first: 6, types: REPOSITORY) {
                        edges {
                            node {
                                ... on Repository {
                                    name
                                    owner {
                                        login
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        """ % self.github_username
        data = self._run_github_query(query)
        if data is None or data.get("repositoryOwner") is None or data.get("repositoryOwner").get("pinnableItems") is None:
            raise Exception("Getting pinned repositories failed. No data found.")

        repo_names = []
        edges = data.get("repositoryOwner").get("pinnableItems").get("edges")
        for edge in edges:
            node = edge.get("node")
            if node.get("owner").get("login") == self.github_username:
                repo_names.append(node.get("name"))

        return repo_names

    def get_repos_file_contents_and_languages(self, repository_names):
        """
        Retrieves the content of important files from multiple repositories. and programming languages used in the repositories with bytes.

        :param repository_names: A list of repository names.
        :return: A dictionary containing the content of important files from the repositories and programming languages used in the repositories.
        """
        file_content = ""
        all_languages_in_repos = {}
        try:
            for repository_name in repository_names:
                languages_in_a_repo = self.get_programming_languages_used(repository_name)
                file_content += self.get_repo_file_content(repository_name, languages_in_a_repo)
                GithubClient.accumulate_language_data(all_languages_in_repos, languages_in_a_repo)
        except Exception as e:
            raise RuntimeError(f"Error Reading files: {e}")

        return {"file_content": file_content, "languages": all_languages_in_repos}

    @staticmethod
    def accumulate_language_data(all_languages_in_repos, repo_languages):
        """
        Accumulates the programming language data from multiple repositories.

        :param all_languages_in_repos: A dictionary containing the programming languages used in the repositories and their bytes.
        :param repo_languages: A dictionary containing the programming languages used in a repository and their bytes.
        """
        for name, bytes in repo_languages.items():
            if name in all_languages_in_repos:
                all_languages_in_repos[name] += bytes
            else:
                all_languages_in_repos[name] = bytes

    @staticmethod
    def get_important_file_names(languages):
        """
        Determines important file names based on programming languages used in a repository.

        :param languages: A list of programming languages (and their usage details) used in the repository.
        :return: A list of names of important files typically associated with the used programming languages.
        """
        important_file_names = ["README.md"]

        package_file_names = {
            "Python": "requirements.txt",
            "JavaScript": "package.json",
            "Ruby": "Gemfile",
            "Java": "pom.xml",
            "Go": "go.mod",
            "php": "composer.json",
            "C#": "packages.config",
            "C++": "CMakeLists.txt",
            "C": "Makefile",
            "TypeScript": "package.json",
            "Shell": "package.json",
            "Kotlin": "build.gradle",
            "Rust": "Cargo.toml",
            "Swift": "Package.swift",
        }

        for language_name in languages:
            if language_name in package_file_names:
                important_file_names.append(package_file_names[language_name])

        return important_file_names

    @staticmethod
    def github_user_exists(username):
        """
        Checks if a GitHub user exists.

        :param username: The GitHub username.
        :return: True if the user exists, False otherwise.
        """
        url = "https://api.github.com/users/" + username
        try:
            res = requests.get(url, headers=Config.GITHUB_REST_API_HEADERS)
        except Exception:
            raise RuntimeError("Error getting GitHub user. Request to GitHub API failed.")
        return res.status_code == 200

    def _get_default_branch(self, repo_name):
        """
        Fetches the default branch name of a given GitHub repository.

        :param github_username: GitHub username.
        :param repo_name: Name of the repository.
        :return: The name of the default branch for the repository.
        """
        url = Config.GITHUB_API_REPO_URL + self.github_username + "/" + repo_name
        try:
            res = requests.get(url, headers=Config.GITHUB_REST_API_HEADERS)
        except Exception:
            raise RuntimeError("Error getting default branch name. Request to GitHub API failed.")

        data = json.loads(res.content)
        if data is None or data.get('default_branch') is None:
            raise RuntimeError("Error getting default branch name.")
        return data.get('default_branch')

    def _is_important_file(self, path, important_file_names, depth=2):
        """
        Determines whether a given file path corresponds to an important file.

        :param path: File path.
        :param important_file_names: List of important file names.
        :return: Boolean indicating if the file is considered important.
        """
        for file_name in important_file_names:
            if file_name in path and path.count('/') <= depth:
                return True
        return False

    def _run_github_query(self, query):
        """
        Executes a GraphQL query on GitHub's API.

        :param query: The GraphQL query string.
        :return: The data returned from the GitHub API.
        """
        try:
            res = requests.post(url=Config.GITHUB_GRAPHQL_API_URL, json={'query': query}, headers=Config.GITHUB_GRAPHQL_API_HEADERS)
            content = json.loads(res.content)
            return content.get("data")
        except Exception:
            raise RuntimeError("Error running GitHub query.")
