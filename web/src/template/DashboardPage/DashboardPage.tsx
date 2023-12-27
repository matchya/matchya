import { AllCandidatesCard, CandidateDetailCard } from '@/components';
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
                  <div className="hidden h-full flex-1 flex-col md:flex">
                    <CandidateDetailCard candidate={selectedCandidate} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 h-[calc(100vh-64px)] overflow-hidden">
      <div className="w-full h-full mx-auto">
        <DashboardBody />
      </div>
    </div>
  );
};

export default DashboardPageTemplate;