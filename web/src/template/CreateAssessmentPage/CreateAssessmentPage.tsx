import { Link } from 'react-router-dom';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Input,
  Button,
} from '@/components';

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
  onTestNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPositionChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onNavigateToQuestionGenerationPage: () => void;
}

const CreateAssessmentPageTemplate = ({
  testName,
  selectedPosition,
  selectedLevel,
  onTestNameChange,
  onPositionChange,
  onLevelChange,
  onNavigateToQuestionGenerationPage,
}: CreateAssessmentPageTemplateProps) => {
  return (
    <div className="w-full min-h-screen h-[1px] bg-macha-200">
      <Link to="/assessments">
        <div className="w-full flex justify-start px-10 py-5">
          <p className="text-xl font-bold text-macha-800">← Back</p>
        </div>
      </Link>
      <div className="w-full flex justify-center items-center">
        <div className="w-full md:w-1/2 lg:w-1/3 mt-20">
          <div className="bg-macha-400 w-1/2 rounded-lg mb-10 mt-5 mx-auto">
            <Input
              value={testName}
              onChange={onTestNameChange}
              type="text"
              className="text-4xl font-bold text-macha-800 p-6 bg-macha-400"
            />
          </div>
          <div className="w-full ">
            <Select onValueChange={onPositionChange} value={selectedPosition}>
              <SelectTrigger className="w-2/3 mx-auto my-4 bg-orange-50">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent className="bg-orange-50 cursor-pointer">
                {positions.map(position => (
                  <SelectItem
                    key={position}
                    value={position}
                    className="cursor-pointer focus:bg-orange-100"
                  >
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={onLevelChange} value={selectedLevel}>
              <SelectTrigger className="w-2/3 mx-auto bg-orange-50">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent className="bg-orange-50">
                {levels.map(level => (
                  <SelectItem
                    key={level}
                    value={level}
                    className="cursor-pointer focus:bg-orange-100"
                  >
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-10 w-full flex justify-center">
            <Button
              onClick={onNavigateToQuestionGenerationPage}
              className="bg-lime-400 text-lg text-macha-50 hover:bg-lime-600 hover:text-macha-100 w-1/2 mx-auto rounded-lg"
            >
              Finish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssessmentPageTemplate;
