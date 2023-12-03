import React, { useState } from 'react';

import Button from '../../components/LoginModal/Button';
import FormInput from '../../components/LoginModal/FormInput';
import { axiosInstance } from '../../helper';
import { useCompanyStore } from '../../store/useCompanyStore';

interface AddCandidateModalProps {
    close: () => void;
  }

  
  const AddCandidateModal = ({ close }: AddCandidateModalProps) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [githubUsername, setGithubUsername] = useState('');
    const [email, setEmail] = useState('');

    const { selectedPosition } = useCompanyStore()
  
    const handleAddCandidate = async (event?: React.MouseEvent) => {
      event?.preventDefault();
      const response = await axiosInstance.post('/checklists/evaluate', {
        checklist_id: selectedPosition?.checklists[0].id,
        candidate_first_name: firstName,
        candidate_last_name: lastName,
        candidate_github_username: githubUsername,
        candidate_email: email,
      });
      if (response.data.status === 'success') {
        console.log(response.data.payload);
        close()
      } else {
        console.log(response.data.message);
      }
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
              label="First Name"
              id="first_name"
              type="text"
              className="my-3"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
            <FormInput
              label="Last Name"
              id="last_name"
              type="text"
              className="my-3"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
            <FormInput
              label="GitHub Account URL"
              id="github_url"
              type="url"
              className="my-3"
              value={githubUsername}
              onChange={e => setGithubUsername(e.target.value)}
            />
            <FormInput
              label="Email Address"
              id="email"
              type="email"
              className="my-3"
              value={email}
              onChange={e => setEmail(e.target.value)}
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