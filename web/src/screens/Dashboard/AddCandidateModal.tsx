import React, { useState } from 'react';

import Button, { Loading } from '../../components/Button';
import FormInput from '../../components/FormInput';
import ToastMessage from '../../components/ToastMessage';
import { axiosInstance } from '../../helper';
import { useCompanyStore } from '../../store/useCompanyStore';
import { CustomError } from '../../types';

interface AddCandidateModalProps {
  close: () => void;
}

const AddCandidateModal = ({ close }: AddCandidateModalProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [email, setEmail] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [isLoading, setIsLoading] = useState(false);

  const { selectedPosition } = useCompanyStore();

  const handleAddCandidate = async (event?: React.FormEvent) => {
    event?.preventDefault();
    setResponseMessage('');
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/checklists/evaluate', {
        checklist_id: selectedPosition?.checklists[0].id,
        candidate_first_name: firstName,
        candidate_last_name: lastName,
        candidate_github_username: githubUsername,
        candidate_email: email,
      });
      if (response.data.status === 'success') {
        setMessageType('success');
        setResponseMessage(
          'Candidate added successfully. It may take a few minutes to evaluate the candidate.'
        );
        setTimeout(() => {
          resetInputValues();
        }, 1000);
      }
    } catch (error) {
      const err = error as CustomError;
      setMessageType('error');
      if (err.response.status === 400) {
        setResponseMessage(err.response.data.message);
      } else {
        setResponseMessage('Something went wrong. Please try again.');
      }
    }
    setIsLoading(false);
  };

  const resetInputValues = () => {
    setFirstName('');
    setLastName('');
    setGithubUsername('');
    setEmail('');
  };

  const clickOutside = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if ((event.target as HTMLDivElement).id === 'outside') {
      setResponseMessage('');
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
        {responseMessage && (
          <ToastMessage message={responseMessage} type={messageType} />
        )}
        <h1 className="text-3xl font-bold text-center">Add a new candidate</h1>
        <div className="space-y-6">
          <form className="space-y-6" onSubmit={handleAddCandidate}>
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
              label="GitHub Account Username"
              id="github_url"
              type="text"
              className="my-3"
              value={githubUsername}
              required={true}
              onChange={e => setGithubUsername(e.target.value)}
            />
            <FormInput
              label="Email Address"
              id="email"
              type="email"
              className="my-3"
              value={email}
              required={true}
              onChange={e => setEmail(e.target.value)}
            />
            <div className="w-full flex justify-center">
              {isLoading ? (
                <Loading />
              ) : (
                <div className="flex justify-end w-full">
                  <Button
                    text="Add"
                    color="green"
                    className="w-1/3"
                    type="submit"
                  />
                  <Button
                    text="Cancel"
                    color="red"
                    className="w-1/3"
                    onClick={close}
                  />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCandidateModal;
