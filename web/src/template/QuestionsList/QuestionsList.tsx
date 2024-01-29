import { Icons, QuestionCard } from '@/components';
import { Question } from '@/types';

interface QuestionsListTemplateProps {
  isLoading: boolean;
  questions: Question[] | null;
}

const QuestionsListTemplate = ({
  isLoading,
  questions,
}: QuestionsListTemplateProps) => (
  <div className="space-y-6 flex-1">
    {isLoading ? (
      <div className="flex flex-col items-center justify-center mt-20">
        <p className="text-lg font-bold text-gray-500">
          Matchya AI is generating questions...
        </p>
        <Icons.spinner className="w-6 h-6 mt-6 spinner" />
      </div>
    ) : questions ? (
      questions.map(question => (
        <QuestionCard
          key={question.id}
          text={question.text}
          keyword={question.topic}
          difficulty={question.difficulty}
        />
      ))
    ) : null}
  </div>
);

export default QuestionsListTemplate;
