import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  QuizDetailsDialog,
} from '../..';

interface QuestionCardProps {
  description: string;
  keyword: string;
  difficulty: string;
  selected: boolean;
  onClick?: () => void;
}

const QuestionCard = ({
  description,
  keyword,
  difficulty,
  selected,
  onClick,
}: QuestionCardProps) => {
  return (
    <Card
      className={`cursor-pointer hover:shadow-md rounded-lg shadow  ${
        selected ? 'border-matcha-400 bg-matcha-30' : 'bg-white'
      }`}
      onClick={onClick}
    >
      <CardHeader className="w-full space-y-0 pt-3 pb-0">
        <div className="space-y-1 w-full">
          <div className="w-full flex  items-center justify-between">
            <CardTitle className="ml-3 text-sm text-muted-foreground">
              Quiz
            </CardTitle>
            <div
              className=""
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <QuizDetailsDialog />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-md text-black">
          {description}
        </CardDescription>
        <div className="flex space-x-2 text-sm text-muted-foreground">
          <Badge className="bg-black hover:bg-black text-white">
            {keyword}
          </Badge>
          <Badge
            className={`text-white ${
              difficulty === 'Easy' || difficulty === 'easy'
                ? 'bg-green-700 hover:bg-green-700'
                : difficulty === 'Medium' || difficulty === 'medium'
                  ? 'bg-yellow-600 hover:bg-yellow-600'
                  : 'bg-red-700 hover:bg-red-700'
            }`}
          >
            {difficulty}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
