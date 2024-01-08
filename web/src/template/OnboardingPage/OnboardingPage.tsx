import icon from '@/assets/matchya-icon-new.png';
import matchya1 from '@/assets/matchya1.png';
import matchya2 from '@/assets/matchya2.png';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';

interface OnboardingPageTemplateProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: () => void;
  scrollDown: () => void;
}

const OnboardingPageTemplate = ({
  email,
  setEmail,
  onSubmit,
  scrollDown,
}: OnboardingPageTemplateProps) => {
  return (
    <div className="w-full h-screen mt-0 bg-lime-100 overflow-y-screen">
      <div className="bg-lime-100 w-full lg:h-full pt-10 lg:pt-10">
        <div className="bg-lime-100 w-full flex items-center h-20 pl-16 cursor-pointer">
          <img src={icon} alt="matchya3" className="w-16 h-16" />
          <h1 className="text-3xl font-bold text-black pl-5">Matchya</h1>
        </div>
        <div className='lg:flex w-full lg:h-full'>
          <div className="w-full lg:w-1/2 p-10 xl:p-20">
            <h1 className="text-6xl md:text-7xl font-bold text-black pb-5 lg:p-10">
              Match ya company with amazing talent
            </h1>
            <h2 className="text-3xl text-black lg:px-10 pb-5">
              AI-powered powerful technical interviews that are easy to set up
              and easy to understand.
            </h2>
            <div className="w-full block lg:hidden">
              <img
                src={matchya1}
                alt="matchya1"
                className="w-full sm:w-2/3 md:w-1/2 md:p-10"
              />
            </div>
            <div className="flex w-full ml-10 mt-6">
              <Button
                variant={'outline'}
                className="px-16 py-6 bg-lime-600 rounded text-white font-bold text-lg hover:bg-lime-700 hover:text-white"
                onClick={scrollDown}
              >
                Try for free
              </Button>
            </div>
          </div>
          <div className="w-1/2 hidden lg:block">
            <img src={matchya1} alt="matchya1" className="w-full p-20" />
          </div>
        </div>
      </div>

      <div className="bg-lime-200 flex w-full lg:h-full pt-10 lg:pt-28">
        <div className="w-full px-5 mx-auto md:w-3/4 lg:w-1/2 lg:px-10 lg:px-28 py-5 xl:pt-10">
          <h2 className="text-5xl font-bold text-black text-center md:text-start">
            Create the perfect interview questions.
          </h2>
          <div className="w-full bg-orange-50 h-36 mt-10  px-10 py-4">
            <p className="text-2xl font-bold text-black">Infuse your data</p>
            <p className="text-lg text-black mt-4 leading-6">
              We integrate with your GitHub, Notion and other tools to create
              relevant, on point questions.
            </p>
          </div>
          <div className="w-full flex bg-teal-50 h-48 mt-10">
            <div className="flex flex-col justify-around  h-full p-5">
              <p className="text-xl xl:text-2xl font-bold text-gray-500">
                Company hub
              </p>
              <p className="text-xl xl:text-2xl font-bold text-gray-500">
                Onboarding
              </p>
              <p className="text-xl xl:text-2xl font-bold text-gray-500">
                Process and lists
              </p>
            </div>

            <div className="flex flex-col justify-around  h-full p-5">
              <p className="text-xl xl:text-2xl font-bold text-black">
                Tag-based questions
              </p>
              <p className="text-xl xl:text-2xl font-bold text-black">
                Leaf scores
              </p>
              <p className="text-xl xl:text-2xl font-bold text-black">
                Peer reviews with Pros
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/2 hidden lg:block">
          <img src={matchya2} alt="matchya2" className="w-full p-16" />
        </div>
      </div>

      <div className="bg-lime-800 pt-16 w-full pb-16 px-10">
        <h2 className="text-4xl md:text-5xl w-full text-center font-bold text-white">
          Tired of recruiting? Try some matchya.
        </h2>
        <div className="w-full">
          <div className="relative w-4/5 sm:w-2/3 md:w-1/2 xl:w-1/3 h-14 mt-12 mx-auto">
            <Input
              className="w-full h-full rounded text-md"
              placeholder="name@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Button
              className="absolute top-2 right-2 bg-black text-white z-10 rounded hover:bg-gray-700 hover:text-white"
              variant="outline"
              onClick={onSubmit}
            >
              Free demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPageTemplate;
