import React, { useState } from 'react';

import Button from '../../components/LoginModal/Button';
import FormInput from '../../components/LoginModal/FormInput';

interface AddCandidateModalProps {
    close: () => void;
  }

  
  const AddCandidateModal = ({ close }: AddCandidateModalProps) => {
    const [name, setName] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
  
    const handleAddCandidate = (event?: React.MouseEvent) => {
      event?.preventDefault();
      console.log(name, githubUrl);
      close();
    };
  
    const clickOutside = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      if ((event.target as HTMLDivElement).id === 'outside') {
        close();
      }
    };
  
    return (
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
        id="outside"
        onClick={clickOutside}
      >
        <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center">Add a new candidate</h1>
          <div className="space-y-6">
            <FormInput
              label="Name"
              id="name"
              type="text"
              className="my-3"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <FormInput
              label="GitHub Account URL"
              id="github_url"
              type="url"
              className="my-3"
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
            />
            <div className="flex justify-end w-full">
              <Button
                text="Add"
                color="green"
                className="w-1/3"
                onClick={handleAddCandidate}
              />
              <Button
                text="Cancel"
                color="red"
                className="w-1/3"
                onClick={close}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

    export default AddCandidateModal;