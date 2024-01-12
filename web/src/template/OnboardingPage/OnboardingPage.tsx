import icon from '@/assets/logo-simple.png';
import banner from '@/assets/matchya1.png';
import Button from '@/components/Button/Button';

interface OnboardingPageTemplateProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: () => void;
  scrollDown: () => void;
}

const OnboardingPageTemplate = ({
  scrollDown,
}: OnboardingPageTemplateProps) => {
  return (
    <div className="w-full min-h-screen h-[1px] bg-macha-200">
      <div className="h-full">
        <div className="w-full bg-macha-200 shadow-lg">
          <div className="flex items-center h-20 cursor-pointer px-4 md:max-w-[1730px] mx-auto">
            <img
              src={icon}
              alt="matchya3"
              className="w-12 h-12 md:w-16 md:h-16 relative bottom-1"
            />
            <h1 className="text-sm md:text-xl font-bold text-black relative right-3">
              Matchya
            </h1>
          </div>
        </div>
        <div className="bg-macha-200 py-12">
          <div className="w-full px-12 md:flex max-w-[1300px] mx-auto">
            <div className="mb-8 md:mb-0 md:w-1/2 flex flex-col items-center justify-center pr-8">
              <div className="w-full mt-6 space-y-4 md:space-y-16 flex flex-col items-center md:block">
                <h1 className="text-4xl md:text-6xl md:leading-18 font-bold text-black md:max-w-[500px] text-center md:text-left">
                  Match ya company with amazing talent.
                </h1>
                <Button
                  variant="outline"
                  className="px-8 py-6 bg-macha-700 rounded border-macha-700 text-white text-md hover:bg-macha-200 hover:border-macha-200"
                  onClick={scrollDown}
                >
                  Try for free
                </Button>
              </div>
            </div>
            <div className="md:pl-12 md:w-1/2 md:flex justify-center items-center">
              <img
                src={banner}
                alt="banner-image"
                className="w-full max-w-[550px] max-h-[550px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPageTemplate;
