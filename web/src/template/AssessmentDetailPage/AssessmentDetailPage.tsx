import { InviteCard, QuestionCard } from '@/components';

const AssessmentDetailPageTemplate = () => (
  <div className="h-full min-h-[calc(100vh-64px)] overflow-hidden bg-macha-200">
    <div className="w-full h-full mx-auto">
      <div className="w-full h-full mx-auto">
        <div className="justify-between items-center py-12">
          <div className="px-12">
            <div className="mb-4">
              <h3 className="text-lg font-bold">SWE TEST</h3>
            </div>
            <div className="flex flex-col-reverse lg:flex-row lg:space-x-6">
              <div className="space-y-6 flex-1">
                <QuestionCard
                  question={'random question'}
                  keyword={'Docker'}
                  difficulty={'medium'}
                />
                <QuestionCard
                  question={'random question'}
                  keyword={'Docker'}
                  difficulty={'medium'}
                />
              </div>
              <div className="mb-6 lg:mb-0">
                <InviteCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AssessmentDetailPageTemplate;
