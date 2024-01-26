import logging


class Logger:
    @staticmethod
    def configure(name: str) -> logging.Logger:
        logger = logging.getLogger(name)
        logger.setLevel(logging.INFO)

        formatter = logging.Formatter('[%(levelname)s]:%(name)s:%(funcName)s:%(lineno)d %(message)s')

        if not logger.handlers:
            ch = logging.StreamHandler()
            ch.setFormatter(formatter)
            logger.addHandler(ch)

        logger.propagate = False
        return logger
