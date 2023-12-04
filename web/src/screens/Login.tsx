import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import matchyaIcon from '/matchya-icon.png';

import Button from '../components/Button';
import FormInput from '../components/FormInput';
import { axiosInstance } from '../helper';

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

  const login = async (input: LoginInput) => {
    try {
      const response = await axiosInstance.post('/login', input);
      if (response.data.status == 'success') {
        navigate('/dashboard');
      }
    } catch (error) {
      setErrorMessage('Login failed. Please try again.');
    }
  };

  const signup = async (input: RegisterInput) => {
    try {
      const response = await axiosInstance.post('/register', input);
      if (response.data.status == 'success') {
        navigate('/dashboard');
      }
    } catch (error) {
      setErrorMessage('Signup failed. Please try again.');
    }
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

  const ErrorToast = ({ message }: { message: string }) => {
    return (
      <div className="bg-red-200 px-6 py-2 mx-2 my-4 rounded-md text-lg flex items-center mx-auto">
        <span className="text-red-800 text-center">{message}</span>
      </div>
    );
  };

  return (
    <div className="h-screen pt-16 inset-0 bg-gray-200 bg-opacity-75 flex justify-center items-center">
      <div className="p-8 bg-white shadow-md rounded-lg w-1/3">
        {errorMessage && <ErrorToast message={errorMessage} />}
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
              onChange={e => setCompanyName(e.target.value)}
            />
          )}
          <FormInput
            label="Email"
            id="email"
            type="email"
            className="my-3"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {authType === 'signup' && (
            <FormInput
              label="GitHub Username"
              id="github_username"
              type="text"
              className="my-3"
              value={githubUsername}
              onChange={e => setGithubUsername(e.target.value)}
            />
          )}
          <FormInput
            label="Password"
            id="password"
            type="password"
            className="mt-3"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <div className="flex justify-center w-full">
            <Button
              text={authType === 'login' ? 'Log in' : 'Sign up'}
              color="green"
              className="w-2/3"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
