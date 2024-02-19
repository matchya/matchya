import { Icons } from '@/components';
import { env } from '@/config';
import { Quiz } from '@/types';

interface InterviewLoadingProps {
  isLoading: boolean;
  quiz: Quiz;
}

const InterviewLoading = ({ isLoading, quiz }: InterviewLoadingProps) => {
  const UnauthorizedHeader = () => (
    <div className="w-full fixed h-16 bg-white flex justify-between items-center px-10 border-b">
      <div className="flex items-center space-x-4 px-4 cursor-pointer">
        <img
          src={`${env.assetsEndpoint}/matchya-sticker.png`}
          alt="logo"
          className="w-32 mb-1"
        />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <>
        <UnauthorizedHeader />
        <div className="w-full h-screen bg-white flex justify-center items-center">
          <Icons.spinner className="spinner w-10 h-10 mx-3" />
          <p className="text-xl font-bold">Receiving Interview Questions...</p>
        </div>
      </>
    );
  }

  if (!isLoading && !quiz) {
    return (
      <>
        <UnauthorizedHeader />
        <div className="w-full h-screen bg-white flex flex-col justify-center items-center">
          <p className="text-xl font-bold">404</p>
          <p className="text-xl font-bold">Interview not found.</p>
        </div>
      </>
    );
  }
  
  return;
};

export default InterviewLoading;
