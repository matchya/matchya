import React, { useState } from 'react';

import { Input, Label } from '@/components';

const Settings = () => {
  const [companyName, setCompanyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [githubUsername, setGithubUsername] = useState<string>('');

  const handleCompanyNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCompanyName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleGithubUsernameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGithubUsername(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle the submission logic here
    console.log('Company Name:', companyName);
    console.log('Email:', email);
    console.log('GitHub Username:', githubUsername);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-1">
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              type="text"
              value={companyName}
              onChange={handleCompanyNameChange}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div>
            <Label htmlFor="github-username">Github Account Username</Label>
            <Input
              id="github-username"
              type="text"
              value={githubUsername}
              onChange={handleGithubUsernameChange}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-lime-300 hover:bg-lime-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-300"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
