import { InviteCard } from '@/components';
import { Assessment } from '@/types';

interface AssessmentDetailPageTemplateProps {
  assessment: Assessment | null;
  isLoading: boolean;
  questionsListFragment: React.ReactNode;
}

const AssessmentDetailPageTemplate = ({
  assessment,
  isLoading,
  questionsListFragment,
}: AssessmentDetailPageTemplateProps) => {
  return (
    <div className="h-full min-h-[calc(100vh-64px)] overflow-hidden bg-matcha-30 text-matcha-900">
      <div className="w-full h-full mx-auto">
        <div className="w-full h-full mx-auto">
          <div className="justify-between items-center py-12">
            <div className="px-12">
              <div className="mb-4">
                {!isLoading && (
                  <h3 className="text-lg font-bold">{assessment?.name}</h3>
                )}
              </div>
              {!isLoading && (
                <div className="flex flex-col-reverse lg:flex-row lg:space-x-6">
                  {questionsListFragment}
                  <div className="mb-6 lg:mb-0">
                    <InviteCard
                      candidates={
                        assessment?.candidates ? assessment?.candidates : []
                      }
                      assessmentId={assessment?.id}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AssessmentDetailPageTemplate;
