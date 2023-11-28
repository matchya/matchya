import ScoreCard from '../../components/LoginModal/ScoreCard';
import { mockCandidates } from '../../data';

import CriteriaBox from './CriteriaBox';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';

const Dashboard = () => {

  return (
    <div className="pt-16 bg-gray-100 h-screen overflow-hidden">
      {' '}
      {/* Padding top for the header */}
      {/* {showModal && <AddCandidateModal close={() => setShowModal(false)} />} */}
      <div className="w-full h-full mx-auto">
        <div className="w-full h-full flex">
          <div className="w-1/6 pt-0 mt-0 h-full bg-gray-300 border border-3">
            <Sidebar />
          </div>
          <div className='w-5/6'>
            <div className="w-full">
              <DashboardHeader /> 
            </div>
            <div className="justify-between items-center py-6 px-10 mt-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-2/3 overflow-hidden sm:rounded-md">
                  <h1 className="text-2xl font-bold text-gray-900 my-4 pl-6">Top Candidates</h1>
                  {mockCandidates.map((candidate, index) => (
                    <ScoreCard key={index} score={candidate} />
                  ))}
                </div>
                <div className="w-1/3 pt-10 bg-white shadow overflow-hidden sm:rounded-md">
                  <CriteriaBox />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
