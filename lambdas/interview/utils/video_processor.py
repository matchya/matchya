import os

from moviepy.video.io.ffmpeg_tools import ffmpeg_extract_audio

from utils.logger import Logger

logger = Logger.configure(os.path.relpath(__file__, os.path.join(os.path.dirname(__file__), '..')))


class VideoProcessor:
    def __init__(self, video_extension='.webm', audio_extension='.wav'):
        self.video_extension = video_extension
        self.audio_extension = audio_extension

    def extract_audio_from_video(self, video_file_path: str) -> str:
        """
        Extracts audio from a video file.

        :param video_file_path: The video file path.
        :return The audio file path.
        """
        logger.info('Extracting audio from video')
        audio_file_path = video_file_path.replace(self.video_extension, self.audio_extension)

        ffmpeg_extract_audio(video_file_path, audio_file_path)
        # video_clip = VideoFileClip(video_file_path)
        # audio_clip = video_clip.audio

        # audio_clip.write_audiofile(audio_file_path, fps=10000, nbytes=2, codec='pcm_s16le')

        # audio_clip.close()
        # video_clip.close()

        logger.info(f'Extracted audio file: {audio_file_path}')
        return audio_file_path
