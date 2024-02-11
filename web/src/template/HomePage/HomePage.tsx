import Button from '@/components/Button/Button';
import { env } from '@/config';

interface HomePageTemplateProps {
  onNavigateToAuthentication: () => void;
}

const HomePageTemplate = ({
  onNavigateToAuthentication,
}: HomePageTemplateProps) => {
  return (
    <div className="w-full min-h-screen h-[1px] bg-matcha-200">
      <div className="h-full">
        <div className="w-full bg-macha-200 shadow-lg">
          <div className="h-20 px-4 md:max-w-[1730px] mx-auto">
            <div className="h-full flex items-center cursor-pointer">
              <img
                src={`${env.assetsEndpoint}/matchya-logo.png`}
                alt="logo"
                className="w-10 h-10 relative bottom-1"
              />
              <h1 className="text-xl font-bold text-black">Matchya</h1>
            </div>
          </div>
        </div>
        <div className="bg-matcha-200 py-12">
          <div className="w-full px-12 md:flex max-w-[1300px] mx-auto">
            <div className="mb-8 md:mb-0 md:w-1/2 flex flex-col items-center justify-center pr-8">
              <div className="w-full mt-6 space-y-4 md:space-y-16 flex flex-col items-center md:block">
                <h1 className="text-4xl md:text-6xl md:leading-18 font-bold text-black md:max-w-[500px] text-center md:text-left">
                  Match ya company with amazing talent.
                </h1>
                <Button
                  variant="outline"
                  className="px-8 py-6 bg-matcha-700 rounded border-matcha-700 text-white text-md hover:bg-matcha-800 hover:border-matcha-800 hover:text-white"
                  onClick={onNavigateToAuthentication}
                >
                  Try for free
                </Button>
              </div>
            </div>
            <div className="md:pl-12 md:w-1/2 md:flex justify-center items-center">
              <img
                src={`${env.assetsEndpoint}/matchya-hero.png`}
                alt="hero-image"
                className="w-full max-w-[550px] max-h-[550px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageTemplate;
