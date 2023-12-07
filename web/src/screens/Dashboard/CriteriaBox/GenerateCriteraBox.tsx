import { useState } from 'react';

import Button, { Loading } from '../../../components/Button';
import ToastMessage from '../../../components/ToastMessage';
import { axiosInstance } from '../../../helper';
import { useCompanyStore } from '../../../store/useCompanyStore';
import { CustomError } from '../../../types';

const GenerateCriteraBox = () => {
  const [selectedRepository, setSelectedRepository] = useState<string>('');
  const [selectedRepositories, setSelectedRepositories] = useState<string[]>(
    []
  );
  const [responseMessage, setResponseMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');
  const [isLoading, setIsLoading] = useState(false);
  const { repository_names, selectedPosition } = useCompanyStore();

  const handleAddRepository = () => {
    if (
      selectedRepository === '' ||
      selectedRepositories.includes(selectedRepository)
    ) {
      return;
    }
    setSelectedRepositories([...selectedRepositories, selectedRepository]);
    setSelectedRepository(
      repository_names.filter(
        (name: string) => !selectedRepositories.includes(name)
      )[0]
    );
  };

  const generateCriteria = async () => {
    if (selectedRepositories.length === 0) {
      setMessageType('error');
      setResponseMessage('Please select at least one repository.');
      return;
    }
    const userData = {
      position_id: selectedPosition?.id,
      repository_names: selectedRepositories,
    };
    setResponseMessage('');
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        '/checklists/generate',
        userData
      );
      if (response.data.status == 'success') {
        setMessageType('success');
        setResponseMessage(
          'Criteria generation is scheduled successfully. It may take a few minutes to generate.'
        );
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

  return (
    <div className="px-6 py-4 flex flex-col items-center">
      {responseMessage && (
        <ToastMessage message={responseMessage} type={messageType} />
      )}
      <h3 className="text-lg font-bold">Generate Criteria</h3>
      <p className="text-sm text-gray-600 mt-4">
        Generate criteria to get started
      </p>
      <select
        value={selectedRepository}
        onChange={e => setSelectedRepository(e.target.value)}
      >
        {repository_names
          .filter((name: string) => !selectedRepositories.includes(name))
          .map((repo: string, index: number) => (
            <option key={index} value={repo}>
              {repo}
            </option>
          ))}
      </select>
      <Button
        text="Add"
        color="green"
        className="mt-4"
        onClick={handleAddRepository}
      />
      {selectedRepositories.map((repo, index) => (
        <div
          key={index}
          className="flex justify-between items-center w-full mt-4"
        >
          <p className="text-sm text-gray-600">{repo}</p>
          <Button
            text="Remove"
            color="red"
            className="w-1/3"
            onClick={() =>
              setSelectedRepositories(
                selectedRepositories.filter(r => r !== repo)
              )
            }
          />
        </div>
      ))}
      {isLoading && <Loading />}
      {!isLoading && (
        <Button
          text="Generate"
          color="green"
          className="mt-4"
          onClick={generateCriteria}
        />
      )}
    </div>
  );
};

export default GenerateCriteraBox;
