import { useState } from 'react';

import Button from '../../components/LoginModal/Button';
import FormInput from '../../components/LoginModal/FormInput';
import { axiosInstance } from '../../helper';
import { Checklist, Criterion } from '../../types';

interface CriteriaBoxProps {
  checklists: Checklist[]
}

const CriteriaBox = ({ checklists }: CriteriaBoxProps) => {
    const [positionId, ] = useState<string>('id');
    const [inputRepository, setInputRepository] = useState<string>('');
    const [repositoryNames, setRepositoryNames] = useState<string[]>([]);


    const generateCriteria = async () => {
        const userData = {"position_id": positionId, "repo_names": repositoryNames};
        try {
            const response = await axiosInstance.post(
                '/checklists/generate',
                userData
            );
            if (response.data.status == 'success') {
                console.log("success")
            }
        } catch (error) {
            console.error('Generating Criteria failed:', error);
            // Handle error (e.g., show error message to the user)
        }
    }

    if (checklists.length === 0) {
      return (
        <div className="px-6 py-4 flex flex-col justify-center items-center">
          <h3 className="text-lg font-bold">Generate Criteria</h3>
          <p className="text-sm text-gray-600 mt-4">
            Generate criteria to get started
          </p>
          <FormInput
            label="Repository Names To Generate Criteria For"
            id="repo_names"
            type="text"
            className="mt-4"
            value={inputRepository}
            onChange={e => setInputRepository(e.target.value)}
          />
          <Button
            text="Add"
            color="green"
            className="mt-4"
            onClick={() => setRepositoryNames([...repositoryNames, inputRepository])}
          />
          {repositoryNames.map((repo, index) => (
            <div key={index} className="flex justify-between items-center w-full mt-4">
              <p className="text-sm text-gray-600">{repo}</p>
              <Button
                text="Remove"
                color="red"
                className="w-1/3"
                onClick={() => setRepositoryNames(repositoryNames.filter(r => r !== repo))}
              />
            </div>
          ))}
          <Button
            text="Generate"
            color="green"
            className="mt-4"
            onClick={generateCriteria}
          />
        </div>
      );
    }

    return (
      <div className="px-6 py-4">
        <h3 className="text-lg font-bold">Generated Criteria</h3>
        <ul className="list-disc pl-6 mt-4">
          {checklists[0].criteria.map((criterion: Criterion) => (
            <li key={criterion.id} className="text-sm text-gray-600">
              {criterion.message}
            </li>
          ))}
        </ul>
      </div>
    );
  };

export default CriteriaBox;
