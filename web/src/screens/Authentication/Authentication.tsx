import { useState } from 'react';

import { Button } from '@/components/Button/Button';
import { Icons } from '@/components/Icons/Icons';
import { clientEndpoint, githubClientId } from '@/config';
import { cn } from '@/lib/utils';

const Authentication = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGithubLogin = () => {
    setIsLoading(true);
    const redirectUri = `${clientEndpoint}/auth/github/callback`;
    const loginUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=repo,user`;

    window.location.href = loginUrl;
  };

  return (
    <>
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
            <svg
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
            </svg>
            Matchya
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
                disabled={isLoading}
                onClick={handleGithubLogin}
                className="w-3/4 h-12 mx-auto text-white bg-black text-xl hover:bg-gray-600 hover:text-white dark:bg-white dark:text-black dark:border-black dark:hover:bg-gray-100 dark:hover:text-black dark:hover:border-black"
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-6 w-6 animate-spin" />
                ) : (
                  <Icons.gitHub className="mr-2 h-6 w-6" />
                )}{' '}
                GitHub
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
    </>
  );
};

export default Authentication;
