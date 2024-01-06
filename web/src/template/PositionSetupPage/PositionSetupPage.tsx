import { useState } from 'react';

import { Button, Icons, MultiSelect } from '@/components';
import { useCompanyStore } from '@/store/store';
interface PositionSetupPageProps {
  inputRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
  phase: number;
  selectedRepositories: string[];
  selectedType: string;
  selectedLevel: string;
  integrateGitHub: () => void;
  handleSelectType: (type: string) => void;
  handleSelectLevel: (level: string) => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleUnselect: (framework: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  handleAddItem: (item: string) => void;
}

const PositionSetupPageTemplate = ({
  inputRef,
  isLoading,
  phase,
  selectedRepositories,
  selectedType,
  selectedLevel,
  integrateGitHub,
  handleSelectType,
  handleSelectLevel,
  handleNext,
  handlePrev,
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
    <div className="bg-gray-200 h-[calc(100vh-64px)] overflow-scroll">
      <div className="w-full h-full mx-auto flex justify-center items-center">
        <div className="h-3/4 w-2/3 mx-auto rounded-2xl flex flex-col items-center">
          <h3 className="text-2xl font-bold mt-16 mb-10 md:mb-24">
            {phase === 0 && 'Integrate with GitHub for better experience'}
            {phase === 1 && 'What type of engineers are you hiring?'}
            {phase === 2 && 'What level of engineers are you hiring?'}
            {phase === 3 &&
              "What is the company's GitHub username / organization name?"}
            {phase === 4 && 'Which repositories do you want to use?'}
          </h3>
          <div className="flex flex-wrap justify-center">
            {phase == 0 && (
              <div>
                <Button
                  className="rounded-full mx-8 mb-5 w-60 bg-white border border-black text-black hover:bg-gray-200"
                  onClick={integrateGitHub}
                >
                  Integrate with GitHub
                </Button>
              </div>
            )}
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
                <input
                  type="text"
                  className="border border-black rounded-full px-4 py-2 w-60"
                  value={organizationName}
                  onChange={e => setOrganizationName(e.target.value)}
                />
              </div>
            )}
            {phase == 4 && (
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
          <div className="w-full flex justify-between items-center my-5 md:my-24">
            <Button
              onClick={handlePrev}
              disabled={
                phase === 0 || (phase === 1 && github_username !== null)
              }
            >
              Back
            </Button>
            <Button onClick={handleNext}>
              {!isLoading && phase === 0 && 'Continue without GitHub'}
              {!isLoading && phase === 1 && 'Next'}
              {!isLoading && phase === 2 && github_username !== null && 'Next'}
              {!isLoading && phase === 2 && !github_username && 'Finish'}
              {!isLoading && phase === 3 && 'Next'}
              {!isLoading && phase === 4 && 'Finish'}
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionSetupPageTemplate;
