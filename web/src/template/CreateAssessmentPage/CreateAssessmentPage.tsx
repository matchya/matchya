import { Link } from 'react-router-dom';

import { Input, Button } from '@/components';
import { Separator } from '@/components';

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
    <div className="w-full min-h-screen flex h-[1px] py-12 overflow-y-scroll">
      <div className="w-full px-4 md:px-12 mx-auto">
        <p className="text-4xl font-bold text-black mb-6">Create Assessment</p>
        <div>
          <div className="mb-6">
            <p className="text-md font-bold text-black mb-2">Assessment Name</p>
            <Input
              value={testName}
              onChange={onTestNameChange}
              type="text"
              className="w-2/3 text-matcha-900 border-gray-200 active:ring-0 focus:ring-0"
            />
          </div>
        </div>
        <div className="my-4">
          <Separator />
        </div>
        <p className="text-md font-bold text-black mb-2">Position Type</p>
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-3">
          {positions.map(position => (
            <Button
              className={
                selectedPosition === position
                  ? 'text-white bg-matcha-400 hover:bg-matchya-400'
                  : ''
              }
              variant={selectedPosition === position ? 'default' : 'outline'}
              onClick={() => onPositionChange(position)}
            >
              {position}
            </Button>
          ))}
        </div>
        <div className="my-4">
          <Separator />
        </div>
        <div>
          <p className="text-md font-bold text-black mb-2">Position Level</p>
          <div className="w-full grid grid-cols-2 gap-3">
            {levels.map(level => (
              <Button
                className={
                  selectedLevel === level
                    ? 'text-white bg-matcha-400 hover:bg-matchya-400'
                    : ''
                }
                variant={selectedLevel === level ? 'default' : 'outline'}
                onClick={() => onLevelChange(level)}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>
        <div className="my-4">
          <Separator />
        </div>
        {/* TO BE IMPLEMENTED */}
        {/* <div>
          <p className="text-md font-bold text-black mb-2">Description</p>
          <Textarea
            className="w-full min-h-[150px] text-black px-3 py-2 border rounded border-gray-200 text-sm resize-none"
            placeholder={
              'Let us know more about your position to generate better questions for you.\n' +
              'ex)\n - Seeking a front-end engineer proficient in design.\n' +
              ' - Back-end engineer with experience working for a large-scale company.'
            }
            value={description}
          />
        </div> */}
        
        <div className="mt-4 w-full flex justify-end">
          <div className="w-1/2 flex justify-end px-4 items-center">
            <Link to="/assessments">
              <p className="font-bold text-black mr-6 cursor-pointer">Cancel</p>
            </Link>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="font-bold bg-matcha-400 text-white hover:bg-matcha-500 hover:text-white py-4 px-3"
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
