// import Webcam from 'react-webcam';
import { useState } from 'react';
import Webcam from 'react-webcam';

import { Button } from '@/components';

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
      {/* Instruction card */}
      <div className="w-full h-96 bg-white flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-center">
          Welcome to the interview
        </h2>
        <p className="text-lg text-center mt-4">
          You will be asked a few questions. Please answer them as best as you
          can.
        </p>
        <Button
          className="bg-orange-300 hover:bg-orange-400 text-white font-bold py-4 px-8 rounded-full mt-4"
          onClick={() => setInstructionPageNumber(2)}
        >
          Next
        </Button>
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
          className="w-60 h-60 sm:w-96 sm:h-96 mx-auto mt-10"
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
      {instructionPageNumber === 1 && <PageOne />}
      {instructionPageNumber === 2 && <PageTwo />}
    </div>
  );
};

export default InterviewInstruction;
