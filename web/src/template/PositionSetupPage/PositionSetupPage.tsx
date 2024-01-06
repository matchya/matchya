import { useState } from 'react';

import { Button } from '@/components';
interface PositionSetupPageProps {
  selectedType: string;
  selectedLevel: string;
  handleSelectType: (type: string) => void;
  handleSelectLevel: (level: string) => void;
  handleSubmit: () => void;
}

const PositionSetupPageTemplate = ({
  selectedType,
  selectedLevel,
  handleSelectType,
  handleSelectLevel,
  handleSubmit,
}: PositionSetupPageProps) => {
  const types = ['Front-end', 'Back-end', 'DevOps', 'Full-stack', 'Others'];
  const levels = ['Entry-level', 'Mid-level', 'Senior-level', 'Do not specify'];
  const [phase, setPhase] = useState(1);

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

  const handleNext = () => {
    if (phase == 1 && selectedType === '') return;
    if (phase == 2 && selectedLevel === '') return;
    if (phase == 2) handleSubmit();
    else setPhase(phase + 1);
  };

  return (
    <div className="bg-gray-200 h-[calc(100vh-64px)] overflow-hidden">
      <div className="w-full h-full mx-auto flex justify-center items-center">
        <div className="h-3/4 w-2/3 mx-auto rounded-2xl flex flex-col items-center">
          <h3 className="text-2xl font-bold mt-16 mb-24">
            What type of engineers are you hiring?
          </h3>
          <div className="flex flex-wrap justify-center">
            {phase == 1 &&
              types.map((type, index) => (
                <Button
                  key={index}
                  onClick={() => handleSelectType(convertType(type))}
                  className={`rounded-full mx-8 my-5 w-60 bg-white border border-black text-black hover:bg-gray-200 ${
                    selectedType === convertType(type)
                      ? 'bg-green-600 text-white hover:bg-green-600'
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
                      ? 'bg-green-600 text-white hover:bg-green-600'
                      : 'bg-white text-black'
                  }`}
                >
                  {level}
                </Button>
              ))}
          </div>
          <div className="w-full flex justify-end items-center mt-24">
            <Button onClick={handleNext}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionSetupPageTemplate;
