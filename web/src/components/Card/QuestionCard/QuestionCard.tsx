import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  QuizDetailsDialog,
} from '../..';

import { Quiz } from '@/types';

interface QuestionCardProps {
  quiz: Quiz;
  selected: boolean;
  onClick?: () => void;
}

const QuestionCard = ({ quiz, selected, onClick }: QuestionCardProps) => {
  return (
    <Card
      // className={`cursor-pointer hover:shadow-md rounded-lg shadow  ${
      //   selected ? 'border-matcha-400 bg-matcha-30' : 'bg-white'
      // }`}
      className={`cursor-pointer hover:border-matcha-400 rounded-lg shadow  ${
        selected ? 'border-matcha-400 bg-matcha-30' : 'bg-white'
      }`}
      onClick={onClick}
      title="Add to Assessment"
    >
      <CardHeader className="w-full space-y-0 pt-3 pb-0">
        <div className="space-y-1 w-full">
          <div className="w-full flex  items-center justify-between">
            {/* <CardTitle className="ml-3 text-sm text-muted-foreground">
              Quiz
            </CardTitle> */}
            <CardTitle className="text-sm text-muted-foreground">
              {quiz.subtopic}
            </CardTitle>
            <div
              className=""
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <QuizDetailsDialog quiz={quiz} />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-md text-black">
          {quiz.description}
        </CardDescription>
        <div className="flex space-x-2 text-sm text-muted-foreground">
          <Badge className="bg-black hover:bg-black text-white">
            {quiz.topic}
          </Badge>
          <Badge
            className={`text-white ${
              quiz.difficulty === 'Easy' || quiz.difficulty === 'easy'
                ? 'bg-green-700 hover:bg-green-700'
                : quiz.difficulty === 'Medium' || quiz.difficulty === 'medium'
                  ? 'bg-yellow-600 hover:bg-yellow-600'
                  : 'bg-red-700 hover:bg-red-700'
            }`}
          >
            {quiz.difficulty}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
