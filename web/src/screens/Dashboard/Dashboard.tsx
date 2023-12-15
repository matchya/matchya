import { useEffect } from 'react';

import DashboardHeader from './DashboardHeader';
import ScoreCard from './ScoreCard';

import { usePositionStore } from '@/store/usePositionStore';

const Dashboard = () => {
  const { positions, selectedPosition } = usePositionStore();

  useEffect(() => {
    if (positions.length === 0) {
      return;
    }
  }, [positions, selectedPosition]);

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
        <div className="w-full">
          <DashboardHeader />
        </div>
        <div className="justify-between items-center py-6 px-10 mt-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-2/3 sm:rounded-md">
              <h1 className="text-2xl font-bold text-gray-900 my-4 pl-6">
                Top Candidates
              </h1>
              <div className="h-[calc(100vh-300px)] overflow-y-scroll">
                {selectedPosition.checklist &&
                  selectedPosition.checklist.candidates.map(
                    (candidate, index) => (
                      <ScoreCard key={index} candidate={candidate} />
                    )
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 h-screen overflow-hidden">
      <div className="w-full h-full mx-auto">
        <DashboardBody />
      </div>
    </div>
  );
};

export default Dashboard;
