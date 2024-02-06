import { Link } from 'react-router-dom';

import { Input, Button, Icons } from '@/components';

const positions = [
  'Software Engineer',
  'Frontend Engineer',
  'Backend Engineer',
  'DevOps Engineer',
  'Mobile Engineer',
  'Fullstack Engineer',
];
const levels = ['Junior', 'Mid-Level', 'Senior', 'Lead'];

interface CreateAssessmentPageTemplateProps {
  testName: string;
  selectedPosition: string;
  selectedLevel: string;
  isLoading: boolean;
  onTestNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPositionChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  handleSubmit: () => void;
}

const CreateAssessmentPageTemplate = ({
  testName,
  selectedPosition,
  selectedLevel,
  isLoading,
  onTestNameChange,
  onPositionChange,
  onLevelChange,
  handleSubmit,
}: CreateAssessmentPageTemplateProps) => {
  return (
    <div className="w-full min-h-screen h-[1px] overflow-y-scroll">
      <div className="w-full md:w-[768px] px-10 py-5 rounded-lg">
        <div className="flex items-center mt-2">
          <Link to="/assessments">
            <div className="flex justify-center items-center h-8 w-8 rounded bg-gray-300 ml-2">
              <Icons.back className="rounded h-6 w-6 mx-auto" />
            </div>
          </Link>
          <p className=" text-2xl font-bold text-black mx-8">
            Create Assessment
          </p>
        </div>
        <div className="bg-white border w-full rounded-lg my-2 mx-auto mt-6 p-6 pl-8">
          <p className="text-sm font-bold text-black mb-2 pl-8">
            Assessment Name
          </p>
          <Input
            value={testName}
            onChange={onTestNameChange}
            type="text"
            className="w-2/3 text-matcha-900 border-black p-1 px-4 active:ring-0 focus:ring-0"
          />
        </div>
        <div className="bg-white border w-full rounded-lg my-2 mx-auto p-6 pl-8">
          <p className="text-sm font-bold text-black mb-2 pl-8">
            Position Type
          </p>
          <div className="w-full flex flex-wrap">
            {positions.map(position => (
              <div
                key={position}
                className="w-1/3 flex justify-start items-center my-2 cursor-pointer"
                onClick={() => onPositionChange(position)}
              >
                <p
                  className={`text-lg font-bold ${
                    selectedPosition === position
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }`}
                >
                  {position}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border w-full rounded-lg my-2 mx-auto p-6 pl-8">
          <p className="text-sm font-bold text-black mb-2 pl-8">
            Position Level
          </p>
          <div className="w-full flex flex-wrap">
            {levels.map(level => (
              <div
                key={level}
                className="w-1/2 flex justify-start items-center my-2 cursor-pointer"
                onClick={() => onLevelChange(level)}
              >
                <p
                  className={`text-lg font-bold ${
                    selectedLevel === level ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {level}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border w-full rounded-lg my-2 mx-auto ">
          <div className="w-full rounded-lg mx-auto px-4 py-2">
            <p className="text-sm mt-4 font-bold text-black mb-2 pl-4">
              Description
            </p>
            <textarea
              className="w-full h-24 mt-4 text-black p-1 px-4 border rounded border-black text-sm resize-none"
              placeholder={
                'Let us know more about your position to generate better questions for you.\n' +
                'ex)\n - Seeking a front-end engineer proficient in design.\n' +
                ' - Back-end engineer with experience working for a large-scale company.'
              }
            />
          </div>
        </div>
        <div className="mt-4 w-full flex justify-end">
          <div className="w-1/2 flex justify-end px-4 items-center">
            <Link to="/assessments">
              <p className="text-md font-bold text-black mr-6 cursor-pointer">
                Cancel
              </p>
            </Link>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-matcha-400 rounded text-md text-white hover:bg-matcha-500 hover:text-white py-4 px-3 rounded-sm"
            >
              Create Assessment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssessmentPageTemplate;
