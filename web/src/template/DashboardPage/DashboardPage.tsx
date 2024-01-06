import { useState } from 'react';

import {
  AllCandidatesCard,
  CandidateDetailCard,
  QuestionCard,
} from '@/components';
import { Candidate, Position } from '@/types';

interface DashboardPageTemplateProps {
  positions: Position[];
  selectedPosition: Position;
  selectedCandidate: Candidate | null;
}

const DashboardPageTemplate = ({
  positions,
  selectedPosition,
  selectedCandidate,
}: DashboardPageTemplateProps) => {
  const [shouldShowQuestions, setShouldShowQuestions] = useState(false);
  const handleShouldShowQuestionsChange = () => {
    setShouldShowQuestions(!shouldShowQuestions);
  };
  const DashboardBody = () => {
    if (positions.length === 0 || !selectedPosition) {
      return <div>loading...</div>;
    }

    return (
      <div>
        <div className="w-full h-full mx-auto">
          <div>
            <div className="justify-between items-center py-4">
              <div className="xl:flex flex-col lg:flex-row gap-4 px-4">
                <div className="w-full xl:max-w-[400px]">
                  <AllCandidatesCard
                    onShouldShowQuestionsCheckedChanged={
                      handleShouldShowQuestionsChange
                    }
                    shouldShowQuestions={shouldShowQuestions}
                    candidates={
                      selectedPosition.candidates?.sort((a, b) => {
                        const dateA = new Date(a.created_at);
                        const dateB = new Date(b.created_at);
                        return dateA > dateB ? 1 : -1;
                      }) || []
                    }
                  />
                </div>
                {selectedCandidate ? (
                  <div className="hidden flex-1 flex-col md:flex h-[calc(100vh-100px)] p-6 rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 col-span-3 overflow-y-auto">
                    <div className="space-y-8 h-full overflow-y-auto">
                      {shouldShowQuestions ? (
                        selectedPosition.questions.map(question => (
                          <QuestionCard {...question} />
                        ))
                      ) : (
                        <CandidateDetailCard candidate={selectedCandidate} />
                      )}
                    </div>
                  </div>
                ) : (
                  <div>No Candidates</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 h-full min-h-[calc(100vh-64px)] overflow-hidden">
      <div className="w-full h-full mx-auto">
        <DashboardBody />
      </div>
    </div>
  );
};

export default DashboardPageTemplate;
