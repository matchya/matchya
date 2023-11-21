import { useState } from 'react';

import matchyaIcon from '/matchya-icon.png';

import Button from './Button';
import FormInput from './FormInput';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  company_name: string;
  github_account_url: string;
}

interface AuthModalProps {
  type: string; // 'login' or 'signup'
  action: (...args: string[]) => void; // login or signup function
  close: () => void;
  switchModal: () => void;
}

const AuthModal = ({ type, action, close, switchModal }: AuthModalProps) => {
  const [companyName, setCompanyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const clickOutside = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if ((event.target as HTMLDivElement).id === 'outside') {
      close();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (type === 'login') {
      action(email, password);
    } else {
      action(companyName, email, githubUrl, password);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
      id="outside"
      onClick={clickOutside}
    >
      <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <img className="h-16 w-16 rounded-full mx-auto" src={matchyaIcon} />
        <h1 className="text-3xl font-bold text-center">
          {type === 'login' ? 'Log in' : 'Sign up'}
        </h1>

        {type === 'login' ? (
          <p className="text-center my-3">
            Create a new account?
            <span
              className="text-blue-500 cursor-pointer"
              onClick={switchModal}
            >
              Sign up
            </span>
          </p>
        ) : (
          <p className="text-center my-3">
            Already have an account?
            <span
              className="text-blue-500 cursor-pointer"
              onClick={switchModal}
            >
              Log in
            </span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'signup' && (
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
          <FormInput
            label="Password"
            id="password"
            type="password"
            className="mt-3"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {type === 'signup' && (
            <FormInput
              label="GitHub Account URL"
              id="github-url"
              type="url"
              className="mt-3"
              value={githubUrl}
              onChange={e => {
                setGithubUrl(e.target.value);
              }}
            />
          )}
          <div className="flex justify-center w-full">
            <Button
              text={type === 'login' ? 'Log in' : 'Sign up'}
              color="green"
              className="w-2/3"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
