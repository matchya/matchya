import base64
import json
import requests

from config import Config


class GithubClient:
    def __init__(self, github_username):
        self.github_username = github_username

    def get_programming_languages_used(self, repository_name):
        """
        Retrieves programming languages used in a specified GitHub repository.

        :param repository_name: Name of the GitHub repository.
        :return: A map of programming languages containing the bytes of code written in each language and its name.
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

    def get_repository_tree(self, repository_name):
        """
        Retrieves the file tree of a GitHub repository.

        :param repository_name: Name of the GitHub repository.
        :return: A list of files and folders in the repository.
        """
        try:
            branch = self._get_default_branch(repository_name)
        except Exception:
            raise RuntimeError("Error getting file tree. Unable to get default branch name.")

        url = Config.GITHUB_API_REPO_URL + self.github_username + "/" + repository_name + "/git/trees/" + branch + "?recursive=1"
        try:
            res = requests.get(url, headers=Config.GITHUB_REST_API_HEADERS)
        except Exception:
            raise RuntimeError("Error getting file tree. Request to GitHub API failed.")

        data = json.loads(res.content)
        if data is None or data.get('tree') is None:
            raise RuntimeError("Error getting file tree. No tree found.")

        tree = data['tree']
        return tree

    def read_file(self, repository_name, file_path):
        """
        Retrieves the contents of a file from a GitHub repository.

        :param repository_name: Repository name.
        :param file_path: Path of the file in the repository.
        :return: The content of the file as a string.
        """
        url = Config.GITHUB_API_REPO_URL + self.github_username + "/" + repository_name + "/contents/" + file_path
        try:
            res = requests.get(url, headers=Config.GITHUB_REST_API_HEADERS)
        except Exception:
            raise RuntimeError("Error getting file contents. Request to GitHub API failed.")

        data = json.loads(res.content)
        if data is None or data.get('content') is None:
            return "(No content found)"

        content_encoded = data['content']
        decoded = base64.b64decode(content_encoded)
        content = decoded.decode("utf-8")
        return content

    def get_pinned_repositories_name(self):
        """
        Retrieves the names of the pinned repositories of a GitHub user.

        :return: A list of the names of the pinned repositories.
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

    @staticmethod
    def get_package_file_paths_to_read(file_paths, languages):
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
    def get_important_file_names_by_languages(languages):
        """
        Returns a list of file names that are important for the given programming languages.

        :param languages: A list of programming languages (and their usage details) used in the repository.
        :return: A list of file names that are important for the given programming languages.
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

    @staticmethod
    def get_organized_folder_structure(paths):
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

    def _get_default_branch(self, repo_name):
        """
        Fetches the default branch name of a given GitHub repository.

        :param repo_name: The name of the GitHub repository.
        """
        url = Config.GITHUB_API_REPO_URL + self.github_username + "/" + repo_name
        try:
            res = requests.get(url, headers=Config.GITHUB_REST_API_HEADERS)
        except Exception:
            raise RuntimeError("Error getting default branch name. Request to GitHub API failed.")

        data = json.loads(res.content)
        if data is None or data.get('default_branch') is None:
            raise RuntimeError("Unable to get default branch name. No data found.")
        return data.get('default_branch')

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
