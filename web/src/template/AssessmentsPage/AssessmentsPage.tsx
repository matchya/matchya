import { Button, Icons, TestTable } from '@/components';
import { Assessment } from '@/types';

interface AssessmentsPageTemplateProps {
  assessments: Assessment[];
  isLoading: boolean;
  onNavigateToAssessment: () => void;
  handleNavigateToDetail: (id: string) => void;
  handleDeleteAssessment: (id: string) => void;
}

const AssessmentsPageTemplate = ({
  assessments,
  isLoading,
  onNavigateToAssessment,
  handleNavigateToDetail,
  handleDeleteAssessment,
}: AssessmentsPageTemplateProps) => (
  <div className="h-full min-h-[calc(100vh-64px)] overflow-hidden">
    <div className="w-full h-full mx-auto">
      <div className="w-full h-full mx-auto">
        <div className="justify-between items-center py-12">
          <div className="px-4 md:px-12">
            <div className="mb-8 flex justify-between items-center">
              <div className="space-y-4">
                <h3 className="text-4xl font-bold">My Assessments</h3>
              </div>
              <Button
                className="pl-3 pr-4 py-6 bg-matcha-400 hover:bg-matcha-500 text-white"
                onClick={onNavigateToAssessment}
              >
                <Icons.plus className="h-5 w-5 mx-1" />
                Create New
              </Button>
            </div>
            {isLoading && (
              <div className="flex mt-48 justify-center items-center">
                <Icons.spinner className="spinner h-8 w-8" />
              </div>
            )}
            {!isLoading && (
              <TestTable
                assessments={assessments}
                handleNavigateToDetail={handleNavigateToDetail}
                handleDeleteAssessment={handleDeleteAssessment}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AssessmentsPageTemplate;
