import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components';
import { env } from '@/config';

interface InterviewInstructionCardProps {
  estimatedTimeInMinutes: number;
  onNext: () => void;
}

const InterviewInstructionCard = ({
  estimatedTimeInMinutes,
  onNext,
}: InterviewInstructionCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="mt-10 w-full mx-auto">
        <CardTitle className="text-center">
          Welcome to Matchya Assessment!
        </CardTitle>
        <CardDescription className="text-center mt-4 px-20 text-black">
          Matchya is a skill assessment platform to measure your skills more
          efficiently and more accurately. From now on, you are going to answer
          some questions created by the company using a webcam.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <img
          src={`${env.assetsEndpoint}/interview-screen.png`}
          alt="assessment"
          className="border border-black rounded w-3/4 mx-auto"
        />
        <p className="text-lg text-center mt-4 px-20">
          This assessment takes around{' '}
          <span className="font-bold">{estimatedTimeInMinutes} minutes</span>.
          Make sure you are in a quiet, relaxing environment before starting the
          exam.
        </p>
        <div className="flex justify-center items-center mt-4">
          <Button
            className="bg-orange-300 hover:bg-orange-400 text-white font-bold py-4 px-8 rounded-full mt-4 mx-auto"
            onClick={onNext}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterviewInstructionCard;
