import { useState } from 'react';

import Button from '../../components/LoginModal/Button';
import { axiosInstance } from '../../helper';
import { useCompanyStore } from '../../store/useCompanyStore';
import { Criterion } from '../../types';


const CriteriaBox = () => {
    const [selectedRepository, setSelectedRepository] = useState<string>('');
    const { repository_names, selectedPosition } = useCompanyStore()
    const [selectedRepositories, setSelectedRepositories ] = useState<string[]>([]);

    const handleAddRepository = () => {
      if (selectedRepository === '' || selectedRepositories.includes(selectedRepository)) {
        return
      }
      setSelectedRepositories([...selectedRepositories, selectedRepository])
      setSelectedRepository(repository_names.filter(name=> !selectedRepositories.includes(name))[0])
    }

    const generateCriteria = async () => {
        const userData = {"position_id": selectedPosition?.id, "repository_names": selectedRepositories};
        try {
            const response = await axiosInstance.post(
                '/checklists/generate',
                userData
            );
            if (response.data.status == 'success') {
                console.log("success")
            }
        } catch (error) {
            console.error('Generating Criteria failed:');
            // Handle error (e.g., show error message to the user)
        }
    }

    if (!selectedPosition || !selectedPosition.checklists || selectedPosition.checklists.length === 0) {
      return (
        <div className="px-6 py-4 flex flex-col justify-center items-center">
          <h3 className="text-lg font-bold">Generate Criteria</h3>
          <p className="text-sm text-gray-600 mt-4">
            Generate criteria to get started
          </p>
          <select value={selectedRepository} onChange={(e) => setSelectedRepository(e.target.value)}>
            {repository_names.filter(name=> !selectedRepositories.includes(name)).map((repo, index) => (
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
            <div key={index} className="flex justify-between items-center w-full mt-4">
              <p className="text-sm text-gray-600">{repo}</p>
              <Button
                text="Remove"
                color="red"
                className="w-1/3"
                onClick={() => setSelectedRepositories(selectedRepositories.filter(r => r !== repo))}
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
          {selectedPosition?.checklists[0].criteria.map((criterion: Criterion) => (
            <li key={criterion.id} className="text-sm text-gray-600">
              {criterion.message}
            </li>
          ))}
        </ul>
      </div>
    );
  };

export default CriteriaBox;
