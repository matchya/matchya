import React from 'react';

import { Input, Label } from '@/components';

interface SettingsPageTemplateProps {
  companyName: string;
  email: string;
  githubUsername: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCompanyNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onGithubUsernameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SettingsPageTemplate = ({
  onSubmit,
  companyName,
  email,
  githubUsername,
  onCompanyNameChange,
  onEmailChange,
  onGithubUsernameChange,
}: SettingsPageTemplateProps) => (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid gap-1">
          <Label htmlFor="company-name">Company Name</Label>
          <Input
            id="company-name"
            type="text"
            value={companyName}
            onChange={onCompanyNameChange}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={onEmailChange}
          />
        </div>
        <div>
          <Label htmlFor="github-username">Github Account Username</Label>
          <Input
            id="github-username"
            type="text"
            value={githubUsername}
            onChange={onGithubUsernameChange}
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

export default SettingsPageTemplate;
