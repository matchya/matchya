import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { axiosInstance } from '../helper';
import { CustomError } from '../types';

import { Button } from '@/components/ui/Button/Button';
import { UserAuthForm } from '@/components/ui/UserAuthForm/UserAuthForm';

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

const Login = () => {
  const navigate = useNavigate();
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const [userInput, setUserInput] = useState({
    companyName: '',
    email: '',
    githubUsername: '',
    password: '',
  });
  const [, setErrorMessage] = useState<string>(''); // TODO: render error message later
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (input: LoginInput) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/login', input);
      if (response.data.status == 'success') {
        navigate('/dashboard');
      }
    } catch (error) {
      const err = error as CustomError;
      if (err.response.status === 400) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    }
    setIsLoading(false);
  };

  const signup = async (input: RegisterInput) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/register', input);
      if (response.data.status == 'success') {
        navigate('/dashboard');
      }
    } catch (error) {
      const err = error as CustomError;
      if (err.response.status === 400) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Signup failed. Please try again.');
      }
    }
    setIsLoading(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
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
          onClick={() => setAuthType(authType === 'login' ? 'signup' : 'login')}
        >
          {authType === 'login' ? 'Login' : 'Register'}
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
            Acme Inc
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
              </p>
            </div>
            <UserAuthForm
              authType={authType}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              userInput={userInput}
              onUserInputChange={setUserInput}
            />
            <p className="px-8 text-center text-sm text-muted-foreground">
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
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
