import { useRef, useState } from 'react';
import Webcam from 'react-webcam';

import { axiosInstance } from '@/lib/client';

const InterviewRecordingPage = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const webcamRef = useRef<Webcam | null>(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const interviewId = '123';
  const questionId = '456';

  const handleVideoCapture = (blob: Blob) => {
    const videoFile = new File([blob], 'video.webm', { type: 'video/webm' });
    setVideoFile(videoFile);
  };

  const uploadVideo = async () => {
    if (!videoFile) {
      alert('No video to upload');
      return;
    }

    // Fetch the presigned POST URL from your server
    const response = await axiosInstance.get(
      `/videos/presigned-url?interview_id=${interviewId}&question_id=${questionId}`
    );

    // Use FormData to build the request
    const formData = new FormData();
    Object.entries(response.data.payload.fields).forEach(([key, value]) => {
      formData.append(key, value as never);
    });
    formData.append('file', videoFile);
    formData.append('Content-Type', 'video/webm');

    // Perform the upload
    try {
      const uploadResponse = await fetch(response.data.payload.url, {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        alert('Video uploaded successfully');
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload error');
    }
  };

  const handleStartRecording = () => {
    setRecording(true);
    const options = { mimeType: 'video/webm' };
    const recorder = new MediaRecorder(
      (webcamRef.current as Webcam).stream as MediaStream,
      options
    );
    recorder.ondataavailable = event => {
      if (event.data && event.data.size > 0) {
        handleVideoCapture(event.data);
      }
    };
    recorder.start();
    setMediaRecorder(recorder);
  };

  const handleStopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };

  return (
    <div>
      <div>
        <Webcam audio={true} ref={webcamRef} />
        {recording ? (
          <button onClick={handleStopRecording}>Stop Recording</button>
        ) : (
          <button onClick={handleStartRecording}>Start Recording</button>
        )}
      </div>
      <button onClick={uploadVideo} disabled={!videoFile}>
        Upload Video
      </button>
    </div>
  );
};

export default InterviewRecordingPage;
