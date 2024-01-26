import json
import os

from utils.logger import Logger

logger = Logger.configure(os.path.basename(__file__))


class PackageInfo:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.package_json = self._load_json()

    def _load_json(self):
        logger.info("_load_json")
        with open(self.file_path) as f:
            return json.load(f)

    def get_version(self) -> str:
        logger.info("get_version")
        return self.package_json.get('version', 'unknown')
