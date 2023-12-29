import base64
import json
import requests
import logging

from config import Config


class GithubClient:
    logger = logging.getLogger('github_client')

    def __init__(self, github_username, github_access_token=None):
        self.github_username = github_username
        if github_access_token is not None:
            self.github_header = {'Authorization': "Bearer " + github_access_token}
        else:
            self.github_header = Config.GITHUB_API_HEADERS
        self.logger.setLevel(logging.INFO)

        formatter = logging.Formatter('[%(levelname)s]:%(funcName)s:%(lineno)d:%(message)s')

        if not self.logger.handlers:
            ch = logging.StreamHandler()
            ch.setFormatter(formatter)
            self.logger.addHandler(ch)

        self.logger.propagate = False

    def get_programming_languages_used(self, repository_full_name: list) -> dict:
        """
        Retrieves programming languages used in a specified GitHub repository.

        :param repository_name: Name of the GitHub repository.
        :return: A map of programming languages containing the bytes of code written in each language and its name.
        """
        url = Config.GITHUB_API_REPO_URL + repository_full_name + "/languages"
        try:
            res = requests.get(url, headers=self.github_header)
        except Exception:
            raise RuntimeError("Error getting programming languages used in repository. Request to GitHub API failed.")
        if res.status_code == 404:
            raise RuntimeError("Error getting programming languages used in repository. Repository not found.")
        data = json.loads(res.content)
        return data

    def get_repository_tree(self, repository_full_name: str) -> list:
        """
        Retrieves the file tree of a GitHub repository.

        :param repository_name: Name of the GitHub repository.
        :return: A list of files and folders in the repository.
        """
        try:
            branch = self._get_default_branch(repository_full_name)
        except Exception as e:
            self.logger.error(f"Error getting file tree. Unable to get default branch name. {e}")
            raise RuntimeError("Error getting file tree. Unable to get default branch name.")

        url = Config.GITHUB_API_REPO_URL + repository_full_name + "/git/trees/" + branch + "?recursive=1"
        try:
            res = requests.get(url, headers=self.github_header)
            if res.status_code == 409:
                self.logger.info("Repository is empty.")
                return []
        except Exception as e:
            self.logger.error(f"Error getting file tree. Request to GitHub API failed. {e}")
            raise RuntimeError("Error getting file tree. Request to GitHub API failed.")

        data = json.loads(res.content)
        if data is None or data.get('tree') is None:
            self.logger.error("Error getting file tree. No tree found.")
            raise RuntimeError("Error getting file tree. No tree found.")

        tree = data['tree']
        return tree

    def read_file(self, repository_full_name: str, file_path: str) -> str:
        """
        Retrieves the contents of a file from a GitHub repository.

        :param repository_name: Repository name.
        :param file_path: Path of the file in the repository.
        :return: The content of the file as a string.
        """
        url = Config.GITHUB_API_REPO_URL + repository_full_name + "/contents/" + file_path
        try:
            res = requests.get(url, headers=self.github_header)
        except Exception as e:
            self.logger.error(f"Error getting file contents. Request to GitHub API failed. {e}")
            raise RuntimeError("Error getting file contents. Request to GitHub API failed.")

        data = json.loads(res.content)
        if data is None or data.get('content') is None:
            return "(No content found)"

        content_encoded = data['content']
        decoded = base64.b64decode(content_encoded)
        content = decoded.decode("utf-8")
        return content

    def get_n_repositories_name(self, n=6) -> list:
        """
        Retrieves the names of the pinned repositories of a GitHub user.

        :return: A list of the names of the pinned repositories.
        """
        query = """
        {
            repositoryOwner(login: "%s") {
                ... on User {
                    pinnableItems(first: %s, types: REPOSITORY) {
                        edges {
                            node {
                                ... on Repository {
                                    nameWithOwner
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
        """ % (self.github_username, n)
        data = self._run_github_query(query)
        if data is None or data.get("repositoryOwner") is None or data.get("repositoryOwner").get("pinnableItems") is None:
            self.logger.error("Getting pinned repositories failed. No data found.")
            raise Exception("Getting pinned repositories failed. No data found.")

        repo_names = []
        edges = data.get("repositoryOwner").get("pinnableItems").get("edges")
        for edge in edges:
            node = edge.get("node")
            if node.get("owner").get("login") == self.github_username:
                repo_names.append(node.get("nameWithOwner"))

        return repo_names

    def get_general_repository_information(self, repository_full_name: str):
        """
        Get information about a repository using github graphql API.

        :param github_username: GitHub username
        :param repository_name: Repository name
        :return: Repository information
        """
        owner, repo = repository_full_name.split("/")
        query = """
            {
                repository(owner: "%s", name: "%s") {
                    createdAt
                    mentionableUsers {
                        totalCount
                    }
                    defaultBranchRef {
                        target {
                            ... on Commit {
                                history(first: 1) {
                                    totalCount
                                }
                            }
                        }
                    }
                    issues {
                        totalCount
                    }
                    pullRequests {
                        totalCount
                    }
                    updatedAt
                }
            }
        """ % (owner, repo)
        data = self._run_github_query(query)
        formatted_data = {}
        formatted_data["created_at"] = data["repository"]["createdAt"]
        formatted_data["contributors"] = data["repository"]["mentionableUsers"]["totalCount"]
        formatted_data["num_commits"] = data["repository"]["defaultBranchRef"]["target"]["history"]["totalCount"]
        formatted_data["issues_and_pull_requests"] = data["repository"]["issues"]["totalCount"] + data["repository"]["pullRequests"]["totalCount"]
        formatted_data["last_updated_at"] = data["repository"]["updatedAt"]
        return formatted_data

    @staticmethod
    def get_package_file_paths_to_read(file_paths: list, languages: dict) -> list:
        """
        Filters out the file paths that are not important for the given programming languages.
        Return up to 10 file paths.

        :param file_paths: A list of file paths.
        :param languages: A list of programming languages (and their usage details) used in the repository.
        :return: A list of file paths that are important for the given programming languages.
        """
        file_names_for_languages = GithubClient.get_important_file_names_by_languages(languages)
        package_file_paths = [path for path in file_paths if path.split("/")[-1] in file_names_for_languages]

        max_depth = 5
        for paths in package_file_paths:
            if paths.count("/") > max_depth:
                max_depth = paths.count("/")

        num_paths = len(package_file_paths)
        while num_paths > 10:
            max_depth -= 1
            for path in package_file_paths:
                if num_paths <= 10:
                    break
                if path.count("/") > max_depth:
                    package_file_paths.remove(path)
                    num_paths -= 1

        return package_file_paths

    @staticmethod
    def get_important_file_names_by_languages(languages: dict) -> list:
        """
        Returns a list of file names that are important for the given programming languages.

        :param languages: A list of programming languages (and their usage details) used in the repository.
        :return: A list of file names that are important for the given programming languages.
        """
        important_file_names = []
        # important_file_names.append("README.md")

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
            "Scala": "build.sbt",
            "Clojure": "project.clj",
            "Haskell": "stack.yaml",
            "Lua": "rockspec",
            "Perl": "Makefile.PL",
            "Dart": "pubspec.yaml",
            "Objective-C": "Podfile",
            "Elixir": "mix.exs",
            "HCL": "main.tf",
            "Groovy": "build.gradle",
            "PowerShell": "psd1",
            "R": "DESCRIPTION",
            "Racket": "info.rkt",
            "Julia": "Project.toml",
            "Dockerfile": "Dockerfile",
        }

        for name, bytes in languages.items():
            if name in package_file_names:
                important_file_names.append(package_file_names[name])

        return important_file_names

    @staticmethod
    def github_user_exists(username: str) -> bool:
        """
        Checks if a GitHub user exists.

        :param username: The GitHub username.
        :return: True if the user exists, False otherwise.
        """
        url = "https://api.github.com/users/" + username
        try:
            res = requests.get(url, headers=Config.GITHUB_API_HEADERS)
        except Exception as e:
            GithubClient.logger.error(f"Error getting GitHub user. Request to GitHub API failed. {e}")
            raise RuntimeError("Error getting GitHub user. Request to GitHub API failed.")
        return res.status_code == 200

    @staticmethod
    def get_organized_folder_structure(paths: list) -> str:
        """
        Organizes a list of file paths into a tree structure.

        :param paths: A list of file paths.
        :return: A string representation of the tree structure.
        """
        tree = {}

        def add_to_tree(base, chain):
            if len(chain) == 1:
                base[chain[0]] = base.get(chain[0], {})
            else:
                node = base.get(chain[0], {})
                base[chain[0]] = node
                add_to_tree(node, chain[1:])

        for path in paths:
            parts = path.split('/')
            add_to_tree(tree, parts)

        def tree_to_string(base, level=0):
            result = ""
            for k, v in sorted(base.items()):
                result += "   " * level + k + "\n"
                if isinstance(v, dict):
                    result += tree_to_string(v, level + 1)
            return result

        return tree_to_string(tree).rstrip()

    def _get_default_branch(self, repo_full_name: str) -> str:
        """
        Fetches the default branch name of a given GitHub repository.

        :param repo_name: The name of the GitHub repository.
        """
        url = Config.GITHUB_API_REPO_URL + repo_full_name
        try:
            res = requests.get(url, headers=self.github_header)
        except Exception as e:
            GithubClient.logger.error(f"Error getting default branch name. Request to GitHub API failed. {e}")
            raise RuntimeError("Error getting default branch name. Request to GitHub API failed.")

        data = json.loads(res.content)
        if data is None or data.get('default_branch') is None:
            self.logger.error("Unable to get default branch name. No data found.")
            raise RuntimeError("Unable to get default branch name. No data found.")
        return data.get('default_branch')

    def _run_github_query(self, query: str):
        """
        Executes a GraphQL query on GitHub's API.

        :param query: The GraphQL query string.
        :return: The data returned from the GitHub API.
        """
        try:
            res = requests.post(url=Config.GITHUB_GRAPHQL_API_URL, json={'query': query}, headers=self.github_header)
            content = json.loads(res.content)
            return content.get("data")
        except Exception as e:
            self.logger.error(f"Error running GitHub query. {e}")
            raise RuntimeError("Error running GitHub query.")
