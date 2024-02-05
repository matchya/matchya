import { Icons, InterviewsTable } from '@/components';
import { Interview } from '@/types';

interface InterviewsPageTemplateProps {
  interviews: Interview[];
  isLoading: boolean;
}

const InterviewsPageTemplate = ({
  interviews,
  isLoading,
}: InterviewsPageTemplateProps) => {
  return (
    <div className="h-full min-h-[calc(100vh-64px)] overflow-hidden">
      <div className="w-full h-full mx-auto">
        <div>
          <div className="w-full h-full mx-auto">
            <div className="justify-between items-center py-12">
              <div className="px-12">
                <div className="mb-8 flex justify-between items-center">
                  <div className="space-y-4">
                    <h3 className="text-4xl font-bold">My Interviews</h3>
                  </div>
                </div>
                {isLoading && (
                  <div className="flex mt-48 justify-center items-center">
                    <Icons.spinner className="spinner h-8 w-8" />
                  </div>
                )}
                {!isLoading && <InterviewsTable interviews={interviews} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewsPageTemplate;
