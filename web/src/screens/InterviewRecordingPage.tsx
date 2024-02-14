import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Webcam from 'react-webcam';

import { axiosInstance } from '@/lib/axios';
import { trackEvent } from '@/lib/rudderstack';
import { InterviewRecordingPageTemplate } from '@/template';
import { Quiz } from '@/types';

const InterviewRecordingPage = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [quizzes, setQuizes] = useState<Quiz[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  // we want to have a separate progress bar count because on the last question
  // without this, it won't show the progress bar at 100% when interview is complete
  const [progressbarCount, setProgressbarCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams<{ id: string }>();
  const interviewId = params.id;
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const sessionToken = sessionStorage.getItem('sessionToken');
    if (sessionToken) {
      axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${sessionToken}`;
      fetchInterviewQuestions();
    }
  }, [params.id, navigate]);

  const invalidateInterviewAccess = async () => {
    const response = await axiosInstance.post(`/auth/invitation/invalidate`);

    if (response.data.status === 'success') {
      sessionStorage.removeItem('sessionToken');
      navigate(`/interviews/${interviewId}/completed`);
    }
  };

  const fetchInterviewQuestions = async () => {
    try {
      const response = await axiosInstance.get(
        `/interviews/${interviewId}/quizzes`
      );
      if (response.data.status === 'success') {
        // caseSensitiveAxiosInstance doesn't work
        const interview = response.data.payload.interview;
        interview.quizzes.map((quiz: any) => {
          quiz.questions = quiz.questions.map((question: any) => {
            return { ...question, questionNumber: question.question_number };
          });
        });
        setQuizes(interview.quizzes);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadVideo = async (blob: Blob) => {
    const videoFile = new File([blob], 'video.webm', { type: 'video/webm' });
    if (!videoFile) {
      alert('No video to upload');
      return;
    }

    // Fetch the presigned POST URL from your server
    const response = await axiosInstance.get(
      `/videos/presigned-url?interview_id=${interviewId}&question_id=${quizzes[quizIndex].id}`
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
        setProgressbarCount(progressbarCount + 1);
        if (quizIndex < quizzes.length - 1) {
          console.log('quizIndex', quizIndex);
          setQuizIndex(quizIndex + 1);
        } else {
          await evaluateInterview();
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
      properties: { quizId: quizzes[quizIndex].id },
    });
    setRecording(true);
    const options = { mimeType: 'video/webm', audioBitsPerSecond: 128000 };
    const recorder = new MediaRecorder(
      (webcamRef.current as Webcam).stream as MediaStream,
      options
    );
    recorder.ondataavailable = async (event) => {
      if (event.data && event.data.size > 0) {
        setIsUploading(true);
        await handleUploadVideo(event.data);
        setIsUploading(false);
      }
    };
    recorder.start();
    setMediaRecorder(recorder);
  };

  const handleStopRecording = async () => {
    trackEvent({
      eventName: 'stop_recording',
      properties: { quizId: quizzes[quizIndex].id },
    });
    mediaRecorder?.stop();
    setRecording(false);
  };

  const evaluateInterview = async () => {
    try {
      const response = await axiosInstance.post(`/interviews/${interviewId}`);
      if (response.data.status === 'success') {
        await invalidateInterviewAccess();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <InterviewRecordingPageTemplate
      isLoading={isLoading}
      isUploading={isUploading}
      quizStarted={quizStarted}
      startQuiz={() => setQuizStarted(true)}
      quiz={quizzes[quizIndex]}
      totalQuizCount={quizzes.length}
      progressbarCount={progressbarCount}
      isRecording={recording}
      webcamRef={webcamRef}
      onStartRecording={handleStartRecording}
      onStopRecording={handleStopRecording}
    />
  );
};

export default InterviewRecordingPage;
