import { Link } from 'react-router-dom';

import {
  Button,
  Input,
  LoadingCard,
  QuestionCard,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
} from '@/components';
import { capitalize } from '@/lib/utils';
import { Quiz } from '@/types';

const positions = [
  'Software Engineer',
  'Frontend Engineer',
  'Backend Engineer',
  'DevOps Engineer',
  'Mobile Engineer',
  'Fullstack Engineer',
];
const levels = ['Junior', 'Mid-Level', 'Senior', 'Lead'];

const difficulties = ['easy', 'medium', 'hard'];

interface CreateAssessmentPageTemplateProps {
  testName: string;
  quizzes: Quiz[];
  selectedPosition: string;
  selectedLevel: string;
  isLoading: boolean;
  isLoadingQuestionGeneration: boolean;
  onTestNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPositionChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  handleSubmit: () => void;
}

const CreateAssessmentPageTemplate = ({
  testName,
  quizzes,
  selectedPosition,
  selectedLevel,
  isLoading,
  isLoadingQuestionGeneration,
  onTestNameChange,
  onPositionChange,
  onLevelChange,
  handleSubmit,
}: CreateAssessmentPageTemplateProps) => {
  return (
    <div className="w-full h-full xl:flex py-12">
      <div className="w-full px-4 md:px-12 xl:pl-8 ">
        <Link to="/assessments">
          <div className="w-full flex justify-start">
            <p className="text-xl font-bold text-matcha-800">← Back</p>
          </div>
        </Link>
        <div className="w-full xl:w-[568px] rounded-lg pt-8">
          <p className="text-4xl font-bold text-black mb-6">
            Create Assessment
          </p>
          <div>
            <div className="mb-6">
              <p className="text-md font-bold text-black mb-2">
                Assessment Name
              </p>
              <Input
                value={testName}
                onChange={onTestNameChange}
                type="text"
                className="w-2/3 text-matcha-900 border-gray-200 active:ring-0 focus:ring-0"
              />
            </div>
          </div>
          <div className="my-6">
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

        <div className="mt-4 w-full justify-end">
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
          <div className="my-6">
            <Separator />
          </div>
          {/* TO BE IMPLEMENTED */}
          <div>
            <p className="text-md font-bold text-black mb-2">Description</p>
            <Textarea
              className="w-full min-h-[100px] text-black px-3 py-2 border rounded border-gray-200 text-sm resize-none"
              placeholder={
                'Let us know more about your position to generate better questions for you.\n' +
                'ex)\n - Seeking a front-end engineer proficient in design.\n' +
                ' - Back-end engineer with experience working for a large-scale company.'
              }
              onChange={() => {}}
              value={''}
            />
          </div>
          <div className="mt-4 w-full flex justify-end">
            <div className="w-1/2 flex justify-end px-4 items-center">
              <Link to="/assessments">
                <p className="font-bold text-black mr-6 cursor-pointer">
                  Cancel
                </p>
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
      <div className="w-full px-4 md:px-12 xl:pl-8 space-y-4 pt-16">
        <div className="">
          <h3 className="text-2xl font-bold">You have selected 4 quizzes</h3>
        </div>
        <div className="flex w-full space-x-3 my-2">
          <div className="w-full">
            <Input placeholder="Ex.Python" className="w-full" />
          </div>
          <Button>Search</Button>
        </div>
        <div className="flex space-x-3">
          <div className="w-full">
            <Input placeholder="Type your question topic here" />
          </div>
          <Select value={`easy`} onValueChange={() => alert('yo')}>
            <SelectTrigger className="h-10 w-[150px]">
              <SelectValue placeholder="easy" />
            </SelectTrigger>
            <SelectContent side="bottom">
              {difficulties.map(difficulty => (
                <SelectItem key={difficulty} value={difficulty}>
                  {capitalize(difficulty)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>Generate with AI</Button>
        </div>
        <div className="space-y-4 overflow-y-scroll">
          {isLoadingQuestionGeneration ? <LoadingCard /> : null}
          {quizzes.map(quiz => (
            <QuestionCard
              description={quiz.description}
              keyword={quiz.topic}
              difficulty={quiz.difficulty}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateAssessmentPageTemplate;
