import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Webcam from 'react-webcam';

import { axiosInstance } from '@/lib/client';
import { CandidateAssessmentPageTemplate } from '@/template';

const InterviewRecordingPage = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const webcamRef = useRef<Webcam | null>(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [interviewDone, setInterviewDone] = useState(false);
  const params = useParams<{ id: string }>();
  const interviewId = params.id;

  useEffect(() => {
    fetchInterviewQuestions();
  }, [params.id]);

  const fetchInterviewQuestions = async () => {
    try {
      const response = await axiosInstance.get(
        `/interviews/${interviewId}/questions`
      );
      if (response.data.status === 'success') {
        const interview = response.data.payload.interview;
        setQuestions(interview.questions);
        console.log(interview.questions);
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  if (interviewDone) {
    return <div>Interview Done. Thank you.</div>;
  }

  return (
    <CandidateAssessmentPageTemplate
      question={questions[questionIndex]}
      index={questionIndex}
      isRecording={recording}
      webcamRef={webcamRef}
      videoFile={videoFile}
      onStartRecording={handleStartRecording}
      onStopRecording={handleStopRecording}
      uploadVideo={uploadVideo}
    />
  );
};

export default InterviewRecordingPage;
