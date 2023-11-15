import React, { useState } from 'react';

const Settings = () => {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  const handleCompanyNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  const handleGithubUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGithubUrl(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle the submission logic here
    console.log('Company Name:', companyName);
    console.log('Email:', email);
    console.log('GitHub URL:', githubUrl);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput label="Company Name" id="company-name" type="text" value={companyName} onChange={handleCompanyNameChange} />
          <FormInput label="Email" id="email" type="email" value={email} onChange={handleEmailChange} />
          <FormInput label="GitHub Account URL" id="github-url" type="url" value={githubUrl} onChange={handleGithubUrlChange} />
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



interface FormInputProps {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({ label, id, type, value, onChange }: FormInputProps ) => {
  return (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}:
        </label>
        <input
          type={type}
          id={id}
          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-300 focus:border-lime-300"
          value={value}
          onChange={onChange}
        />
      </div>
  );
}