import logoImage from '@/assets/matchya-icon.png';
import { Button, Icons } from '@/components';
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
    </div>
    <div className="min-h-screen container relative hidden flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg> */}
          <img src={logoImage} alt="Logo" className="h-10 w-auto mr-6 ml-4 rounded-full" />
          <p>Matchya</p>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Matchya bridges the gap between technical expertise and
              non-technical understanding, making GitHub accessible to
              all.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Log in to Matchya
            </h1>
          </div>
          <div className={cn('grid gap-6')}>
            <Button
              variant="outline"
              type="button"
              disabled={isGitHubLoading || isGoogleLoading}
              onClick={onGithubLogin}
              className="w-3/4 h-12 mx-auto text-white bg-black text-xl hover:bg-gray-600 hover:text-white dark:bg-white dark:text-black dark:border-black dark:hover:bg-gray-100 dark:hover:text-black dark:hover:border-black"
            >
              {isGitHubLoading ? (
                <Icons.spinner className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                <Icons.gitHub className="mr-2 h-6 w-6" />
              )}{' '}
              GitHub
            </Button>
            <Button
              variant="outline"
              type="button"
              disabled={isGitHubLoading || isGoogleLoading}
              onClick={onGoogleLogin}
              className="w-3/4 h-12 mx-auto border border-2 text-black bg-white text-xl hover:bg-gray-100 hover:text-black dark:bg-white dark:text-black dark:border-black dark:hover:bg-gray-100 dark:hover:text-black dark:hover:border-black"
            >
              {isGoogleLoading ? (
                <Icons.spinner className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-6 w-6" />
              )}{' '}
              Google
            </Button>
            
          </div>
          {/* To be implemented... */}
          {/* <p className="px-8 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{' '}
        <Link
          to="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          <Button asChild>Terms of Service</Button>
        </Link>{' '}
        and{' '}
        <Link
          to="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          <Button asChild>Privacy Policy</Button>
        </Link>
        .
      </p> */}
        </div>
      </div>
    </div>
  </div>
);

export default AuthenticationPageTemplate;
