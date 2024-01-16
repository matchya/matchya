import { InterviewsTable } from '@/components';
import { mockedInterviews } from '@/data/mock';

const InterviewsPageTemplate = () => {
  return (
    <div className="h-full min-h-[calc(100vh-64px)] overflow-hidden">
      <div className="w-full h-full mx-auto">
        <div>
          <div className="w-full h-full mx-auto">
            <div className="justify-between items-center py-12">
              <div className="px-12">
                <div className="mb-8 flex justify-between items-center">
                  <div className="space-y-4">
                    <h3 className="text-4xl font-bold">Interviews</h3>
                  </div>
                </div>
                <InterviewsTable interviews={mockedInterviews} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewsPageTemplate;
