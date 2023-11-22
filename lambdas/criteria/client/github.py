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
        :return: A list of programming languages used in the repository.
        """
        url = "https://api.github.com/repos/" + self.github_username + "/" + repository_name + "/languages"
        res = requests.get(url, headers=Config.GITHUB_REST_API_HEADERS)
        data = json.loads(res.content)
        return [{"name": language, "bytes": data[language]} for language in data]

    def get_important_file_urls(self, repo_name, important_file_names):
        """
        Fetches URLs of important files from a GitHub repository.

        :param github_username: GitHub username.
        :param repo_name: Repository name.
        :param important_file_names: A list of important file names to look for.
        :return: A list of file paths for important files in the repository.
        """
        branch = self._get_default_branch(repo_name)

        url = Config.GITHUB_API_REPO_URL + self.github_username + "/" + repo_name + "/git/trees/" + branch + "?recursive=1"
        res = requests.get(url, headers=Config.GITHUB_REST_API_HEADERS)

        data = json.loads(res.content)
        tree = data['tree']
        file_paths = []
        for file in tree:
            if file['type'] == 'blob' and self._is_important_file(file['path'], important_file_names):
                file_paths.append(file['path'])
        return file_paths

    def get_file_paths_in_repo(self, github_username, repo_name, file_names_containing_repo_tech_stack):
        """
        Retrieves the file paths of important files in a GitHub repository.

        :param github_username: GitHub username of the repository owner.
        :param repo_name: Name of the GitHub repository.
        :param file_names_containing_repo_tech_stack: List of important file names to find in the repository.
        :return: A list of file paths for important files in the repository.
        """
        branch = self._get_default_branch(repo_name)

        url = "https://api.github.com/repos/" + github_username + "/" + repo_name + "/git/trees/" + branch + "?recursive=1"
        res = requests.get(url, headers=Config.GITHUB_REST_API_HEADERS)
        data = json.loads(res.content)
        tree = data['tree']
        return [branch['path'] for branch in tree if self._should_include_the_branch(branch, file_names_containing_repo_tech_stack)]

    def get_file_contents(self, repo_name, file_path):
        """
        Retrieves the contents of a file from a GitHub repository.

        :param github_username: GitHub username.
        :param repository_name: Repository name.
        :param file_path: Path of the file in the repository.
        :return: The content of the file as a string.
        """
        url = Config.GITHUB_API_REPO_URL + self.github_username + "/" + repo_name + "/contents/" + file_path
        res = requests.get(url, headers=Config.GITHUB_REST_API_HEADERS)

        data = json.loads(res.content)
        if data is None or data.get('content') is None:
            return ""
        content_encoded = data['content']
        content = str(base64.b64decode(content_encoded))
        return content

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

        for language in languages:
            if language['name'] in package_file_names:
                important_file_names.append(package_file_names[language['name']])

        return important_file_names

    def _get_default_branch(self, repo_name):
        """
        Fetches the default branch name of a given GitHub repository.

        :param github_username: GitHub username.
        :param repo_name: Name of the repository.
        :return: The name of the default branch for the repository.
        """
        url = Config.GITHUB_API_REPO_URL + self.github_username + "/" + repo_name
        res = requests.get(url, headers=Config.GITHUB_REST_API_HEADERS)

        data = json.loads(res.content)
        if data is None or data.get('default_branch') is None:
            print("default branch not found / api limit exceeded", repo_name)
            print(data)
            exit(1)
        return data['default_branch']

    def _is_important_file(self, path, important_file_names):
        """
        Determines whether a given file path corresponds to an important file.

        :param path: File path.
        :param important_file_names: List of important file names.
        :return: Boolean indicating if the file is considered important.
        """
        for file_name in important_file_names:
            if file_name in path and path.count('/') <= 1:
                return True
        return False

    def _should_include_the_branch(self, branch, file_names_containing_repo_tech_stack):
        """
        Determines if a branch contains important files based on their names.

        :param branch: A branch object from the GitHub repository tree.
        :param file_names_containing_repo_tech_stack: List of important file names.
        :return: Boolean indicating whether the branch should be included or not.
        """
        branch_name = branch['path'].split('/')[-1]
        is_file = branch['type'] == 'blob'
        does_contain_info = branch_name in file_names_containing_repo_tech_stack
        in_root_or_subroot_dir = branch['path'].count('/') <= 1

        return is_file and does_contain_info and in_root_or_subroot_dir
