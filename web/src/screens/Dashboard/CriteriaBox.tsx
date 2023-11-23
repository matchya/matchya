import axios from 'axios';
import { useEffect, useState } from 'react';

import Button from '../../components/LoginModal/Button';
import FormInput from '../../components/LoginModal/FormInput';
import { apiEndpoint } from '../../config';

const CriteriaBox = () => {
    const [positionId, ] = useState<string>('id');
    const [inputRepository, setInputRepository] = useState<string>('');
    const [repositoryNames, setRepositoryNames] = useState<string[]>([]);
    const [criteria, setCriteria] = useState<string[]>([]);

    useEffect(() => {
      if (!criteria.length) {
        getCriteria();
      }
    }, [])

    const getCriteria = async () => {
        try {
            const response = await axios.get(
                `${apiEndpoint}/criteria/${positionId}`, 
                {headers: {'Content-Type': 'application/json', 'Authorization': `Bearer validToken`}}
            );
            if (response.status == 200) {
                setCriteria(response.data.criteria)
            }
        } catch (error) {
            console.error('Retrieving Criteria failed:', error);
            // Handle error (e.g., show error message to the user)
        }
    }

    const generateCriteria = async () => {
        const userData = {"position_id": positionId, "repo_names": repositoryNames};
        try {
            const response = await axios.post(
                `${apiEndpoint}/generate`,
                userData,
                {headers: {'Content-Type': 'application/json', 'Authorization': `Bearer validToken`}}
            );
            if (response.status == 200) {
                setCriteria(response.data.criteria)
            }
        } catch (error) {
            console.error('Generating Criteria failed:', error);
            // Handle error (e.g., show error message to the user)
        }
    }
  
    if (!criteria.length) {
      return (
        <div className="px-6 py-4 h-full flex flex-col justify-center items-center">
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
      <div className="px-6 py-4 h-full">
        <h3 className="text-lg font-bold">Generated Criteria</h3>
        <ul className="list-disc pl-6 mt-4">
          {criteria.map((criterion, index) => (
            <li key={index} className="text-sm text-gray-600">
              {criterion}
            </li>
          ))}
        </ul>
      </div>
    );
  };

export default CriteriaBox;