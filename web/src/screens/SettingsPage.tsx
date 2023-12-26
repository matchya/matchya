import React, { useState } from 'react';

import { SettingsPageTemplate } from '@/template';

const SettingsPage = () => {
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
    <SettingsPageTemplate
      companyName={companyName}
      email={email}
      githubUsername={githubUsername}
      onSubmit={handleSubmit}
      onGithubUsernameChange={handleGithubUsernameChange}
      onEmailChange={handleEmailChange}
      onCompanyNameChange={handleCompanyNameChange}
    />
  );
};

export default SettingsPage;
