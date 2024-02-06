import { Badge, Button, Icons } from '@/components';
import { env } from '@/config';
import { cn } from '@/lib/utils';

interface AuthenticationPageTemplateProps {
  isGoogleLoading: boolean;
  onGoogleLogin: () => void;
}

const AuthenticationPageTemplate = ({
  isGoogleLoading,
  onGoogleLogin,
}: AuthenticationPageTemplateProps) => (
  <div>
    <div className="min-h-screen w-full relative md:flex-col grid lg:max-w-none lg:grid-cols-2">
      <div className="hidden bg-macha-500 relative h-full flex-col dark:border-r lg:flex"></div>
      <div className="fixed top-8 left-8 z-20 flex items-center text-lg font-medium">
        <div className="h-full flex items-center cursor-pointer">
          <img
            src={`${env.assetsEndpoint}/matchya-sticker.png`}
            alt="logo"
            className="h-10 relative "
          />
        </div>
      </div>
      <div className="bg-matcha-200 h-full flex items-center justify-center w-full">
        <div className="lg:p-8">
          <div className="flex justify-center mb-4">
            <Badge className="bg-matcha-900">Beta</Badge>
          </div>
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Sign in to your Matchya Account
              </h1>
            </div>
            <div className={cn('grid gap-6')}>
              <Button
                variant="outline"
                type="button"
                disabled={isGoogleLoading}
                onClick={onGoogleLogin}
                className="flex gap-4 w-full py-6 mx-auto border text-black bg-white text-md hover:bg-gray-100 hover:text-black dark:bg-white dark:text-black dark:border-black dark:hover:bg-gray-100 dark:hover:text-black dark:hover:border-black"
              >
                {isGoogleLoading ? (
                  <Icons.spinner className="h-6 w-6 spinner" />
                ) : (
                  <Icons.google className="h-5 w-5" />
                )}{' '}
                Sign in with Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AuthenticationPageTemplate;
