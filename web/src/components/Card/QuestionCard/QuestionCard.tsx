import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
      className={`rounded-lg shadow  ${
        selected ? 'border-matcha-400 bg-matcha-30' : 'bg-white'
      }`}
      onClick={onClick}
    >
      <CardHeader className="grid items-start gap-4 space-y-0">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <CardTitle className="text-sm text-muted-foreground">
              Quiz
            </CardTitle>
          </div>
          <CardDescription className="text-md text-black">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* <div className="grid grid-cols-2 gap-2">
          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
            <RocketIcon className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Metric 1
              </p>
              <p className="text-sm text-muted-foreground">{metrics[0]}</p>
            </div>
          </div>
          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
            <MagicWandIcon className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Metric 2
              </p>
              <p className="text-sm text-muted-foreground">{metrics[1]}</p>
            </div>
          </div>
          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
            <LightningBoltIcon className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Metric 3
              </p>
              <p className="text-sm text-muted-foreground">{metrics[2]}</p>
            </div>
          </div>
          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
            <FaceIcon className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-muted-foreground">
                Metric 4
              </p>
              <p className="text-sm text-muted-foreground">{metrics[3]}</p>
            </div>
          </div>
        </div> */}
        <div className="flex space-x-2 text-sm text-muted-foreground">
          <Badge className="bg-black text-white">{keyword}</Badge>
          <Badge
            className={`text-white ${
              difficulty === 'easy'
                ? 'bg-green-700'
                : difficulty === 'medium'
                  ? 'bg-yellow-600'
                  : 'bg-red-700'
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
