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
  isLoading: boolean;
  isLoadingQuestionGeneration: boolean;
  description: string;
  quizzes: Quiz[];
  selectedQuizzes: Quiz[];
  selectedPosition: string;
  selectedLevel: string;
  quizTopic: string;
  quizDifficulty: string;
  searchQuery: string;
  assessmentName: string;
  onDescriptionChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAssessmentNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPositionChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onTopicInputChange: (value: string) => void;
  onDifficultyInputChange: (value: string) => void;
  setSelectedQuizzes: (quizzes: Quiz[]) => void;
  setSearchQuery: (value: string) => void;
  onSearch: () => void;
  onSubmit: () => void;
  handleGenerateQuiz: () => void;
}

const CreateAssessmentPageTemplate = ({
  isLoading,
  isLoadingQuestionGeneration,
  description,
  quizzes,
  selectedQuizzes,
  selectedPosition,
  selectedLevel,
  quizTopic,
  quizDifficulty,
  searchQuery,
  assessmentName,
  onDescriptionChange,
  onAssessmentNameChange,
  onPositionChange,
  onLevelChange,
  onTopicInputChange,
  onDifficultyInputChange,
  setSelectedQuizzes,
  setSearchQuery,
  onSearch,
  onSubmit,
  handleGenerateQuiz,
}: CreateAssessmentPageTemplateProps) => {
  return (
    <div className="w-full h-full xl:flex py-12">
      <div className="w-full px-4 md:px-12 xl:pl-8">
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
                value={assessmentName}
                onChange={onAssessmentNameChange}
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
        <div className="mt-4 w-full justify-end">
          <div>
            <p className="text-md font-bold text-black mb-2">Position Level</p>
            <div className="w-full grid grid-cols-4 gap-3">
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
          <div>
            <p className="text-md font-bold text-black mb-2">Description</p>
            <Textarea
              className="w-full min-h-[100px] text-black px-3 py-2 border rounded border-gray-200 text-sm resize-none"
              placeholder={
                'Let us know more about your position to generate better questions for you.\n' +
                'ex)\n - Seeking a front-end engineer proficient in design.\n' +
                ' - Back-end engineer with experience working for a large-scale company.'
              }
              onChange={onDescriptionChange}
              value={description}
            />
          </div>
          <div className="mt-4 w-full flex items-center justify-end">
            <Link to="/assessments">
              <p className="font-bold text-black mr-6 cursor-pointer">Cancel</p>
            </Link>
            <Button
              onClick={onSubmit}
              disabled={isLoading}
              className="font-bold bg-matcha-400 text-white hover:bg-matcha-500 hover:text-white py-4 px-3"
            >
              Create Assessment
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full px-4 md:px-12 xl:pl-8 space-y-4 pt-16 pr-1">
        <div className="">
          <h3 className="text-2xl font-bold">You have selected {selectedQuizzes.length} quizzes</h3>
        </div>
        <div className="flex w-full space-x-3 my-2">
          <div className="w-full">
            <Input placeholder="Ex.Python" className="w-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Button onClick={onSearch}>Search</Button>
        </div>
        <div className="flex space-x-3">
          <div className="w-full">
            <Input
              placeholder="Type your question topic here"
              value={quizTopic}
              onChange={e => onTopicInputChange(e.target.value)}
            />
          </div>
          <Select
            value={quizDifficulty}
            onValueChange={val => onDifficultyInputChange(val)}
          >
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
          <Button onClick={handleGenerateQuiz}>Generate with AI</Button>
        </div>
        <div className="space-y-4 overflow-y-auto max-h-[490px]">
          {isLoadingQuestionGeneration ? <LoadingCard /> : null}
          {quizzes.length === 0 ? (
            <p className="text-lg font-bold text-black">No quizzes found</p>
          ) : null}
          {quizzes.map(quiz => (
            <QuestionCard
              quiz={quiz}
              selected={selectedQuizzes.some(q => q.id === quiz.id)}
              onClick={() => {
                if (selectedQuizzes.some(q => q.id === quiz.id)) {
                  setSelectedQuizzes(
                    selectedQuizzes.filter(q => q.id !== quiz.id),
                  );
                } else {
                  setSelectedQuizzes([...selectedQuizzes, quiz]);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateAssessmentPageTemplate;
