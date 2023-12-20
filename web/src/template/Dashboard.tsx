import { useEffect } from 'react';

import { AllCandidatesCard } from '@/components/ui/Card/AllCandidatesCard/AllCandidatesCard';
import { CandidateDetailCard } from '@/components/ui/Card/CandidateDetailCard/CandidateDetailCard';
import { usePositionStore } from '@/store/usePositionStore';

const DashboardT = () => {
  const { selectedPosition } = usePositionStore();

  useEffect(() => {
    if (selectedPosition?.checklist) {
      setSelectedCandidateId(selectedPosition.checklist.candidates[0].id);
    }
  }, [selectedPosition]);

  if (!selectedPosition) {
    return <div>loading...</div>;
  }

  return (
    <div className="bg-gray-100 overflow-hidden">
      <div className="w-full h-full mx-auto">
        <div>
          <div className="justify-between items-center py-4">
            <div className="xl:flex flex-col lg:flex-row gap-4 px-4">
              <div className="w-full xl:max-w-[400px]">
                {selectedPosition?.checklist ? (
                  <AllCandidatesCard
                    candidates={selectedPosition.checklist.candidates}
                  />
                ) : null}
              </div>
              <div className="hidden h-full flex-1 flex-col md:flex">
                <CandidateDetailCard
                  candidate={selectedPosition.checklist.candidates[0]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardT;
