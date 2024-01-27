import json
import os

from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class PackageInfo:
    def __init__(self, file_path):
        self.file_path = file_path
        self.package_json = self._load_json()

    def _load_json(self):
        logger.info("_load_json")
        with open(self.file_path) as f:
            return json.load(f)

    def get_version(self):
        logger.info("get_version")
        return self.package_json.get('version', 'unknown')
