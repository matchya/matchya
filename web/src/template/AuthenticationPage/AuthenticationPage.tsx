import matchyaLogo from '@/assets/matchya-logo.png';
import { Badge, Button, Icons } from '@/components';
import { cn } from '@/lib/utils';

interface AuthenticationPageTemplateProps {
  isGitHubLoading: boolean;
  isGoogleLoading: boolean;
  onGithubLogin: () => void;
  onGoogleLogin: () => void;
}

const AuthenticationPageTemplate = ({
  isGitHubLoading,
  isGoogleLoading,
  onGithubLogin,
  onGoogleLogin,
}: AuthenticationPageTemplateProps) => (
  <div>
    <div className="md:hidden">
      <img
        src="/examples/authentication-light.png"
        width={1280}
        height={843}
        alt="Authentication"
        className="block dark:hidden"
      />
      <img
        src="/examples/authentication-dark.png"
        width={1280}
        height={843}
        alt="Authentication"
        className="hidden dark:block"
      />
      <div className="w-[1280px] h-[843px] " />
    </div>
    <div className="min-h-screen container relative hidden flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-macha-500" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img
            src={matchyaLogo}
            alt="Logo"
            className="w-12 h-12 md:w-16 md:h-16 relative bottom-1"
          />
          <h1 className="text-sm md:text-xl font-bold text-black relative right-3">
            Matchya
          </h1>
        </div>
      </div>
      <div className="h-full bg-macha-200 flex items-center justify-center">
        <div className="lg:p-8">
          <div className="flex justify-center mb-4">
            <Badge className="bg-macha-900">Beta</Badge>
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
                disabled={isGitHubLoading || isGoogleLoading}
                onClick={onGithubLogin}
                className="flex gap-4 w-full py-6 mx-auto text-white bg-black text-md hover:bg-gray-600 hover:text-white dark:bg-white dark:text-black dark:border-black dark:hover:bg-gray-100 dark:hover:text-black dark:hover:border-black"
              >
                {isGitHubLoading ? (
                  <Icons.spinner className="h-5 w-5 animate-spin" />
                ) : (
                  <Icons.gitHub className="h-5 w-5" />
                )}{' '}
                Sign in with GitHub
              </Button>
              <Button
                variant="outline"
                type="button"
                disabled={isGitHubLoading || isGoogleLoading}
                onClick={onGoogleLogin}
                className="flex gap-4 w-full py-6 mx-auto border text-black bg-white text-md hover:bg-gray-100 hover:text-black dark:bg-white dark:text-black dark:border-black dark:hover:bg-gray-100 dark:hover:text-black dark:hover:border-black"
              >
                {isGoogleLoading ? (
                  <Icons.spinner className="h-5 w-5 animate-spin" />
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
