import { useEffect } from 'react';

import { useCompanyStore } from '../../store/useCompanyStore';

import CriteriaBox from './CriteriaBox';
import DashboardHeader from './DashboardHeader';
import ScoreCard from './ScoreCard';

const Dashboard = () => {
  const { positions, selectedPosition, setSelectedPositionDetail } =
    useCompanyStore();

  useEffect(() => {
    if (positions.length === 0 || !selectedPosition) return;
    handleSetPositionDetail();
  }, [selectedPosition]);

  const handleSetPositionDetail = async () => {
    try {
      await setSelectedPositionDetail();
    } catch (error) {
      console.log(error);
    }
  };

  const DashboardBody = () => {
    if (
      positions.length === 0 ||
      !selectedPosition ||
      !selectedPosition.checklists
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
                {selectedPosition.checklists?.length > 0 &&
                  selectedPosition.checklists[0].candidates.map(
                    (candidate, index) => (
                      <ScoreCard key={index} candidate={candidate} />
                    )
                  )}
              </div>
            </div>
            <div className="w-1/3 h-full pt-2 bg-white shadow overflow-hidden sm:rounded-md">
              <CriteriaBox />
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
