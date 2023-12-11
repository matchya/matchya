import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { axiosInstance } from '../../helper';
import { CustomError } from '../../types';

import { Button, buttonVariants } from '@/components/ui/Button/Button';
import { UserAuthForm } from '@/components/ui/UserAuthForm/UserAuthForm';
import { cn } from '@/lib/utils';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  github_username: string;
}

const Authentication = () => {
  const navigate = useNavigate();
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const [userInput, setUserInput] = useState({
    companyName: '',
    email: '',
    githubUsername: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (input: LoginInput) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/login', input);
      if (response.data.status === 'success') {
        navigate('/dashboard');
      }
    } catch (error) {
      const err = error as CustomError;
      if (err.response.status === 400) {
        console.error(err.response.data.message);
      } else {
        console.error('Login failed. Please try again.');
      }
    }
    setIsLoading(false);
  };

  const signup = async (input: RegisterInput) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/register', input);
      if (response.data.status === 'success') {
        navigate('/dashboard');
      }
    } catch (error) {
      const err = error as CustomError;
      if (err.response.status === 400) {
        console.error(err.response.data.message);
      } else {
        console.error('Signup failed. Please try again.');
      }
    }
    setIsLoading(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (authType === 'login') {
      login({ email: userInput.email, password: userInput.password });
    } else {
      signup({
        name: userInput.companyName,
        email: userInput.email,
        password: userInput.password,
        github_username: userInput.githubUsername,
      });
    }
  };

  const handleUserInputChange = (field: string, value: string) => {
    setUserInput({
      ...userInput,
      [field]: value,
    });
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
        <Button
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute right-4 top-4 md:right-8 md:top-8'
          )}
          onClick={() => setAuthType(authType === 'login' ? 'signup' : 'login')}
        >
          {authType === 'login' ? 'Sign Up' : 'Login'}
        </Button>
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
                {authType === 'login' ? 'Login' : 'Sign Up'}
              </h1>
            </div>
            <UserAuthForm
              authType={authType}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              userInput={userInput}
              onUserInputChange={handleUserInputChange}
            />
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
