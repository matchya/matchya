import React, { useState } from 'react';

const Settings = () => {
  const [companyName, setCompanyName] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  const handleCompanyNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCompanyName(event.target.value);
  };

  const handleGithubUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGithubUrl(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle the submission logic here
    console.log('Company Name:', companyName);
    console.log('GitHub URL:', githubUrl);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="company-name"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name:
            </label>
            <input
              type="text"
              id="company-name"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-300 focus:border-lime-300"
              value={companyName}
              onChange={handleCompanyNameChange}
            />
          </div>
          <div>
            <label
              htmlFor="github-url"
              className="block text-sm font-medium text-gray-700"
            >
              GitHub Account URL:
            </label>
            <input
              type="text"
              id="github-url"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-300 focus:border-lime-300"
              value={githubUrl}
              onChange={handleGithubUrlChange}
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
