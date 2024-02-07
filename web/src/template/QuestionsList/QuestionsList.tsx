import { Icons, QuestionCard } from '@/components';
import { Quiz } from '@/types';

interface QuestionsListTemplateProps {
  isLoading: boolean;
  quizes: Quiz[] | null;
}

const QuestionsListTemplate = ({
  isLoading,
  quizes,
}: QuestionsListTemplateProps) => (
  <div className="space-y-6 flex-1">
    {isLoading ? (
      <div className="flex flex-col items-center justify-center mt-20">
        <p className="text-lg font-bold text-gray-500">
          Matchya AI is generating questions...
        </p>
        <Icons.spinner className="w-6 h-6 mt-6 spinner" />
      </div>
    ) : quizes ? (
      quizes.map(quiz => (
        <QuestionCard
          key={quiz.id}
          description={quiz.description}
          keyword={quiz.topic}
          difficulty={quiz.difficulty}
        />
      ))
    ) : null}
  </div>
);

export default QuestionsListTemplate;
