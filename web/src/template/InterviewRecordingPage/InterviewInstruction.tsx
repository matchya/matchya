// import Webcam from 'react-webcam';
import { useState } from 'react';
import Webcam from 'react-webcam';

import { Button } from '@/components';
import InterviewInstructionCard from '@/components/Card/InterviewInstructionCard/InterviewInstructionCard';
import { env } from '@/config';

// import { env } from '@/config';

interface InterviewInstructionProps {
  webcamRef?: React.RefObject<Webcam>;
  audioConstraints?: MediaTrackConstraints;
  videoConstraints?: boolean | MediaTrackConstraints;
  startQuiz: () => void;
}

const InterviewInstruction = ({
  webcamRef,
  audioConstraints,
  videoConstraints,
  startQuiz,
}: InterviewInstructionProps) => {
  const [instructionPageNumber, setInstructionPageNumber] = useState<number>(1);

  const PageOne = () => (
    <div className="w-full h-[90vh] bg-white flex flex-col justify-center items-center">
      <div className="w-1/2  flex flex-col justify-center items-center">
        <InterviewInstructionCard estimatedTimeInMinutes={20} onNext={() => setInstructionPageNumber(2)} />
      </div>
    </div>
  );

  const PageTwo = () => (
    <div className="w-full h-[90vh] bg-white flex flex-col justify-center items-center">
      {/* Setting up camera and audio */}
      <div className="w-full h-96 bg-white flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-center">
          Set up your camera and audio
        </h2>
        <p className="text-lg text-center mt-4">
          Please make sure your camera and audio are working properly before
          starting the interview.
        </p>
        <Webcam
          className="w-96 h-96 mx-auto mt-10"
          audioConstraints={audioConstraints}
          videoConstraints={videoConstraints}
          audio={true}
          muted={true}
          ref={webcamRef}
        />
        <Button
          className="bg-orange-300 hover:bg-orange-400 text-white font-bold py-4 px-8 rounded-full mt-4"
          onClick={startQuiz}
        >
          Start Interview
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col justify-between">
      <div className="w-full fixed h-16 bg-white flex justify-between items-center px-10 border-b">
        <div className="flex items-center space-x-4 px-4 cursor-pointer">
          <img
            src={`${env.assetsEndpoint}/matchya-sticker.png`}
            alt="logo"
            className="w-32 mb-1"
          />
        </div>
      </div>
      {instructionPageNumber === 1 && <PageOne />}
      {instructionPageNumber === 2 && <PageTwo />}
    </div>
  );
};

export default InterviewInstruction;
