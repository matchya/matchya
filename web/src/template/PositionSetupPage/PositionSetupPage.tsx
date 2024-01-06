import { useState } from 'react';

import { Button, MultiSelect } from '@/components';
import { useCompanyStore } from '@/store/store';
interface PositionSetupPageProps {
  inputRef: React.RefObject<HTMLInputElement>;
  phase: number;
  selectedRepositories: string[];
  selectedType: string;
  selectedLevel: string;
  handleSelectType: (type: string) => void;
  handleSelectLevel: (level: string) => void;
  handleNext: () => void;
  handleUnselect: (framework: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  handleAddItem: (item: string) => void;
}

const PositionSetupPageTemplate = ({
  inputRef,
  phase,
  selectedRepositories,
  selectedType,
  selectedLevel,
  handleSelectType,
  handleSelectLevel,
  handleNext,
  handleUnselect,
  handleKeyDown,
  handleAddItem,
}: PositionSetupPageProps) => {
  const types = ['Front-end', 'Back-end', 'DevOps', 'Full-stack', 'Others'];
  const levels = ['Entry-level', 'Mid-level', 'Senior-level', 'Do not specify'];
  const { github_username, repository_names } = useCompanyStore();
  const [organizationName, setOrganizationName] = useState(github_username);

  const convertType = (type: string) => {
    switch (type) {
      case 'Front-end':
        return 'frontend';
      case 'Back-end':
        return 'backend';
      case 'DevOps':
        return 'devops';
      case 'Full-stack':
        return 'fullstack';
      default:
        return 'default';
    }
  };

  const convertLevel = (level: string) => {
    switch (level) {
      case 'Entry-level':
        return 'entry';
      case 'Mid-level':
        return 'mid';
      case 'Senior-level':
        return 'senior';
      default:
        return 'default';
    }
  };

  return (
    <div className="bg-gray-200 h-[calc(100vh-64px)] overflow-hidden">
      <div className="w-full h-full mx-auto flex justify-center items-center">
        <div className="h-3/4 w-2/3 mx-auto rounded-2xl flex flex-col items-center">
          <h3 className="text-2xl font-bold mt-16 mb-24">
            {phase === 1 && 'What type of engineers are you hiring?'}
            {phase === 2 && 'What level of engineers are you hiring?'}
            {phase === 3 && 'Integrate with GitHub for better experience'}
            {phase === 4 &&
              "What is the company's GitHub username / organization name?"}
            {phase === 5 && 'Which repositories do you want to use?'}
          </h3>
          <div className="flex flex-wrap justify-center">
            {phase == 1 &&
              types.map((type, index) => (
                <Button
                  key={index}
                  onClick={() => handleSelectType(convertType(type))}
                  className={`rounded-full mx-8 my-5 w-60 bg-white border border-black text-black hover:bg-gray-200 ${
                    selectedType === convertType(type)
                      ? 'bg-green-400 text-white hover:bg-green-500'
                      : 'bg-white text-black'
                  }`}
                >
                  {type}
                </Button>
              ))}
            {phase == 2 &&
              levels.map((level, index) => (
                <Button
                  key={index}
                  onClick={() => handleSelectLevel(convertLevel(level))}
                  className={`rounded-full mx-8 my-5 w-60 bg-white border border-black text-black hover:bg-gray-200 ${
                    selectedLevel === convertLevel(level)
                      ? 'bg-green-400 text-white hover:bg-green-500'
                      : 'bg-white text-black'
                  }`}
                >
                  {level}
                </Button>
              ))}
            {phase == 3 && (
              <div>
                <Button className="rounded-full mx-8 mb-5 w-60 bg-white border border-black text-black hover:bg-gray-200">
                  Integrate with GitHub
                </Button>
              </div>
            )}
            {phase == 4 && (
              <div>
                <input
                  type="text"
                  className="border border-black rounded-full px-4 py-2 w-60"
                  value={organizationName}
                  onChange={e => setOrganizationName(e.target.value)}
                />
              </div>
            )}
            {phase == 5 && (
              <MultiSelect
                options={repository_names.sort((a, b) => {
                  if (a.split('/')[0] === organizationName) return -1;
                  if (b.split('/')[0] === organizationName) return 1;
                  return 0;
                })}
                placeholder="Repositories"
                onUnselect={handleUnselect}
                onKeyDown={handleKeyDown}
                selected={selectedRepositories}
                onAddItem={handleAddItem}
                inputRef={inputRef}
              />
            )}
          </div>
          <div className="w-full flex justify-end items-center mt-24">
            <Button onClick={handleNext}>
              {phase === 1 && 'Next'}
              {phase === 2 && 'Next'}
              {phase === 3 && 'Continue without GitHub'}
              {phase === 4 && 'Next'}
              {phase === 5 && 'Finish'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionSetupPageTemplate;
