import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Label,
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
      <div className="grid gap-1">
        <Label htmlFor="testName">Test Name</Label>
        <Input
          id="testName"
          placeholder="Random test"
          type="text"
          value={testName}
          onChange={onTestNameChange}
        />
      </div>
      <div className="flex">
        <Select onValueChange={onPositionChange} value={selectedPosition}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Position" />
          </SelectTrigger>
          <SelectContent>
            {positions.map(position => (
              <SelectItem key={position} value={position}>
                {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={onLevelChange} value={selectedLevel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            {levels.map(level => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Button onClick={onNavigateToQuestionGenerationPage}>Finish</Button>
      </div>
    </div>
  );
};

export default CreateAssessmentPageTemplate;
