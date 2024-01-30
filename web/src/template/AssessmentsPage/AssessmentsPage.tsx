import { Button, TestTable } from '@/components';
import { Assessment } from '@/types';

interface AssessmentsPageTemplateProps {
  assessments: Assessment[];
  isLoading: boolean;
  onNavigateToAssessment: () => void;
  handleNavigateToDetail: (id: string) => void;
}

const AssessmentsPageTemplate = ({
  assessments,
  isLoading,
  onNavigateToAssessment,
  handleNavigateToDetail,
}: AssessmentsPageTemplateProps) => (
  <div className="h-full min-h-[calc(100vh-64px)] overflow-hidden">
    <div className="w-full h-full mx-auto">
      <div>
        <div className="w-full h-full mx-auto">
          <div className="justify-between items-center py-12">
            <div className="px-12">
              <div className="mb-8 flex justify-between items-center">
                <div className="space-y-4">
                  <h3 className="text-4xl font-bold">Assessments</h3>
                </div>
                <Button
                  onClick={onNavigateToAssessment}
                  className="bg-orange-200 text-black shadow hover:bg-orange-300"
                >
                  Create New
                </Button>
              </div>
              {!isLoading && (
                <TestTable
                  assessments={assessments}
                  handleNavigateToDetail={handleNavigateToDetail}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AssessmentsPageTemplate;
