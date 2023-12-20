import { useEffect } from 'react';

import { AllCandidatesCard } from '@/components/ui/Card/AllCandidatesCard/AllCandidatesCard';
import { CandidateDetailCard } from '@/components/ui/Card/CandidateDetailCard/CandidateDetailCard';
import { usePositionStore } from '@/store/usePositionStore';

const Dashboard = () => {
  const { selectedPosition, positions, selectCandidate } = usePositionStore();

  useEffect(() => {
    if (selectedPosition?.checklist && selectedPosition.candidates) {
      selectCandidate(selectedPosition.candidates[0]);
    }
  }, [selectedPosition]);

  if (!selectedPosition) {
    return <div>loading...</div>;
  }

  const DashboardBody = () => {
    if (
      positions.length === 0 ||
      !selectedPosition ||
      !selectedPosition.checklist
    ) {
      return <div>loading...</div>;
    }

    return (
      <div>
        <div className="w-full h-full mx-auto">
          <div>
            <div className="justify-between items-center py-4">
              <div className="xl:flex flex-col lg:flex-row gap-4 px-4">
                <div className="w-full xl:max-w-[400px]">
                  {selectedPosition?.checklist ? (
                    <AllCandidatesCard
                      candidates={selectedPosition.candidates}
                    />
                  ) : null}
                </div>
                <div className="hidden h-full flex-1 flex-col md:flex">
                  <CandidateDetailCard />
                </div>
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

export default Dashboard;
