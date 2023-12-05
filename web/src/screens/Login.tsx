import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import matchyaIcon from '/matchya-icon.png';

import Button, { Loading } from '../components/Button';
import ErrorToast from '../components/ErrorToast';
import FormInput from '../components/FormInput';
import { axiosInstance } from '../helper';
import { CustomError } from '../types';

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
  const [companyName, setCompanyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [githubUsername, setGithubUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
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
      login({ email, password });
    } else {
      signup({
        name: companyName,
        email,
        password,
        github_username: githubUsername,
      });
    }
  };

  return (
    <div className="h-screen pt-16 inset-0 bg-gray-200 bg-opacity-75 flex justify-center items-center">
      <div className="p-8 bg-white shadow-md rounded-lg w-1/3">
        {errorMessage && <ErrorToast message={errorMessage} type="error" />}
        <img className="h-16 w-16 rounded-full mx-auto" src={matchyaIcon} />
        <h1 className="text-3xl font-bold text-center">
          {authType === 'login' ? 'Log in' : 'Sign up'}
        </h1>

        <p className="text-center my-3">
          {authType === 'login'
            ? "Don't have an account?"
            : 'Already have an account?'}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => {
              setAuthType(authType === 'login' ? 'signup' : 'login');
            }}
          >
            {authType === 'login' ? ' Sign up' : ' Log in'}
          </span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {authType === 'signup' && (
            <FormInput
              label="Company Name"
              id="company-name"
              type="text"
              className="my-3"
              value={companyName}
              required={true}
              onChange={e => setCompanyName(e.target.value)}
            />
          )}
          <FormInput
            label="Email"
            id="email"
            type="email"
            className="my-3"
            value={email}
            required={true}
            onChange={e => setEmail(e.target.value)}
          />
          {authType === 'signup' && (
            <FormInput
              label="GitHub Username"
              id="github_username"
              type="text"
              className="my-3"
              value={githubUsername}
              required={true}
              onChange={e => setGithubUsername(e.target.value)}
            />
          )}
          <FormInput
            label="Password"
            id="password"
            type="password"
            className="mt-3"
            value={password}
            required={true}
            onChange={e => setPassword(e.target.value)}
          />
          <div className="flex justify-center w-full">
            {isLoading ? (
              <Loading />
            ) : (
              <Button
                text={authType === 'login' ? 'Log in' : 'Sign up'}
                color="green"
                className="w-2/3"
                type="submit"
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
