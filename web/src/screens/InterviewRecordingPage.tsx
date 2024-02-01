import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Webcam from 'react-webcam';

import { axiosInstance } from '@/lib/axios';
import { trackEvent } from '@/lib/rudderstack';
import { InterviewRecordingPageTemplate } from '@/template';
import { Question } from '@/types';

const InterviewRecordingPage = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const webcamRef = useRef<Webcam | null>(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [interviewDone, setInterviewDone] = useState(false);
  const params = useParams<{ id: string }>();
  const interviewId = params.id;
  const navigate = useNavigate();

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('sessionToken');
    if (sessionToken) {
      axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${sessionToken}`;
      try {
        fetchInterviewQuestions();
      } catch (err) {
        navigate('/404');
      }
    } else {
      navigate('/404');
    }
  }, [params.id, navigate]);

  useEffect(() => {
    if (interviewDone) {
      invalidateInterviewAccess();
    }
  }, [interviewDone]);

  const invalidateInterviewAccess = async () => {
    const response = await axiosInstance.post(`/auth/invitation/invalidate`);

    if (response.data.status === 'success') {
      sessionStorage.removeItem('sessionToken');
      // navigate to the InterviewDone page
      navigate(`/interviews/${interviewId}/completed`);
    }
  };

  const fetchInterviewQuestions = async () => {
    const response = await axiosInstance.get(
      `/interviews/${interviewId}/questions`
    );
    if (response.data.status === 'success') {
      const interview = response.data.payload.interview;
      setQuestions(interview.questions);
      console.log(interview.questions);
    }
  };

  const handleVideoCapture = (blob: Blob) => {
    const videoFile = new File([blob], 'video.webm', { type: 'video/webm' });
    setVideoFile(videoFile);
  };

  const handleUploadVideo = async () => {
    if (!videoFile) {
      alert('No video to upload');
      return;
    }

    // Fetch the presigned POST URL from your server
    const response = await axiosInstance.get(
      `/videos/presigned-url?interview_id=${interviewId}&question_id=${questions[questionIndex].id}`
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
        setVideoFile(null);
        if (questionIndex < questions.length - 1) {
          setQuestionIndex(questionIndex + 1);
        } else {
          alert('Interview completed');
          evaluateInterview();
        }
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload error');
    }
  };

  const handleStartRecording = () => {
    trackEvent({
      eventName: 'start_recording',
      properties: { questionId: questions[questionIndex].id },
    });
    setRecording(true);
    const options = { mimeType: 'video/webm', audioBitsPerSecond: 128000 };
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
    trackEvent({
      eventName: 'stop_recording',
      properties: { questionId: questions[questionIndex].id },
    });
    mediaRecorder?.stop();
    setRecording(false);
  };

  const evaluateInterview = async () => {
    try {
      const response = await axiosInstance.post(`/interviews/${interviewId}`);
      if (response.data.status === 'success') {
        setInterviewDone(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <InterviewRecordingPageTemplate
      question={questions[questionIndex]}
      index={questionIndex}
      isRecording={recording}
      webcamRef={webcamRef}
      videoFile={videoFile}
      onStartRecording={handleStartRecording}
      onStopRecording={handleStopRecording}
      onUploadVideo={handleUploadVideo}
    />
  );
};

export default InterviewRecordingPage;
