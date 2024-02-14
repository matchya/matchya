import Webcam from 'react-webcam';

import InterviewInstruction from './InterviewInstruction';
import InterviewLoading from './InterviewLoading';

import { Button, Icons, ProgressBar } from '@/components';
import { env } from '@/config';
import { Quiz, Interview } from '@/types';

const VIDEO_CONSTRAINTS: boolean | MediaTrackConstraints | undefined = {
  width: 1280,
  height: 720,
  facingMode: 'user',
};

const AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  advanced: [
    {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  ],
};

interface InterviewRecordingPageTemplateProps {
  progressbarCount: number;
  totalQuizCount: number;
  quiz: Quiz;
  quizStarted: boolean;
  startQuiz: () => void;
  interview?: Interview;
  isLoading: boolean;
  isUploading: boolean;
  isRecording: boolean;
  webcamRef?: React.RefObject<Webcam>;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const InterviewRecordingPageTemplate = ({
  progressbarCount,
  totalQuizCount,
  quiz,
  quizStarted,
  startQuiz,
  interview,
  isLoading,
  isUploading,
  isRecording,
  webcamRef,
  onStartRecording,
  onStopRecording,
}: InterviewRecordingPageTemplateProps) => {

  const UnauthorizedHeaderWithData = () => (
    <div className="w-full h-16 flex justify-between items-center px-10 border-b">
      <div className="h-full flex items-center cursor-pointer">
        <img
          src={`${env.assetsEndpoint}/matchya-sticker.png`}
          alt="logo"
          className="w-32 relative bottom-1"
        />
      </div>
      <div className="flex w-1/2 justify-around">
        <div className="ml-auto flex items-center space-x-4 hidden sm:block">
          <p className="text-lg">Welcome, Takeshi Hashimoto</p>
        </div>
        <div className="ml-auto flex items-center space-x-4 hidden sm:block">
          <p className="text-lg">Matchya - SWE Test</p>
        </div>
      </div>
    </div>
  );

  const BodyHeader = () => (
    <div className="flex items-center justify-center px-20 pt-4 border-matcha-700 pb-4">
      <div className="w-1/2">
        <p className="text-2xl font-bold">3:38</p>
      </div>
      <div className="flex justify-end">
        <ProgressBar
          className="w-[200px]"
          value={(progressbarCount / totalQuizCount) * 100}
        />
        {/* Header for Candidate Assessment Page */}
        <div className="w-full h-16 flex justify-between items-center px-10 border-b">
          <div className="h-full flex items-center cursor-pointer">
            <img
              src={`${env.assetsEndpoint}/matchya-sticker.png`}
              alt="logo"
              className="w-32 relative bottom-1"
            />
          </div>
          <div className="flex w-1/2 justify-around">
            <div className="ml-auto flex items-center space-x-4 hidden sm:block">
              <p className="text-lg">
                Welcome
                {interview?.candidate.name
                  ? `, ${interview.candidate.name}`
                  : ''}
                !
              </p>
            </div>
            <div className="ml-auto flex items-center space-x-4 hidden sm:block">
              <p className="text-lg">
                {interview?.assessment.name ?? 'Assessment'}
              </p>
            </div>
          </div>
        </div>

        {/* Time and Question count */}
        <div className="flex items-center justify-center px-20 pt-4 border-matcha-700 pb-4">
          <div className="w-1/2">
            {/* TODO: implement a functional timer later */}
            {/* <p className="text-2xl font-bold">3:38</p> */}
          </div>
          <div className="flex justify-end">
            <ProgressBar
              className="w-[200px]"
              value={(progressbarCount / totalQuizCount) * 100}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const InterviewBody = () => (
    <>
      <div>
        <div className="flex flex-col justify-center items-center pt-4 w-2/3 mx-auto">
          <div className="px-20">
            <p className="text-3xl font-bold text-center mb-4">Question {progressbarCount + 1}</p>
            <p className="text-2xl font-bold text-center mb-4">Context</p>
            <p className="text-xl font-bold text-center">{quiz.context}</p>
          </div>

          <div className="w-2/3 mx-auto flex flex-wrap  pt-10">
            {quiz.questions
              ?.sort((a, b) => (a.questionNumber < b.questionNumber ? -1 : 1))
              .map(question => (
                <p className="text-md my-4">
                  {question.questionNumber}. {question.text}
                </p>
              ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full items-center py-20">
        {isUploading ? (
          <Button className="bg-transparent hover:bg-gray-50 text-orange-300 font-bold py-8 px-10 text-xl rounded-full border-2 border-orange-300">
            <Icons.spinner className="h-6 w-6 mr-2 spinner" />
          </Button>
        ) : (
          <Button
            className="bg-transparent hover:bg-gray-50 text-orange-300 font-bold py-8 px-10 text-xl rounded-full border-2 border-orange-300"
            onClick={isRecording ? onStopRecording : onStartRecording}
          >
            <Icons.circle className="h-6 w-6 mr-2" />
            
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
        )}
      </div>
    </>
  );

  if (isLoading || (!isLoading && !quiz)) {
    return <InterviewLoading isLoading={isLoading} quiz={quiz} />;
  }

  if (!quizStarted) {
    return (
      <InterviewInstruction
        webcamRef={webcamRef}
        videoConstraints={VIDEO_CONSTRAINTS}
        audioConstraints={AUDIO_CONSTRAINTS}
        startQuiz={startQuiz}
      />
    );
  }

  return (
    <div className="w-full h-screen flex flex-col justify-between">
      <UnauthorizedHeaderWithData />
      <BodyHeader />
      <Webcam
        className="hidden"
        audioConstraints={AUDIO_CONSTRAINTS}
        videoConstraints={VIDEO_CONSTRAINTS}
        audio={true}
        muted={true}
        ref={webcamRef}
      />
      <InterviewBody />
    </div>
  );
};

export default InterviewRecordingPageTemplate;
