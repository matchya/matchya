import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ScoreCard from '../../components/LoginModal/ScoreCard';
import { axiosInstance } from '../../helper';
import { useCompanyStore } from '../../store/useCompanyStore';
import { Position } from '../../types';

import CriteriaBox from './CriteriaBox';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';


const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [updatingPosition, setUpdatingPosition] = useState<boolean>(false)
  const { me, id, positions } = useCompanyStore();

  useEffect(() => {
    if (id) return;
    try {
      me();
    } catch (error) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    getSelectedPosition()
  }, [selectedPosition])

  const getSelectedPosition = async () => {
    if (selectedPosition == null || selectedPosition.checklists) return;
    setUpdatingPosition(true)
    console.log("get position")
    const response = await axiosInstance.get(`/positions/${selectedPosition.id}`)
    if (response.data.status === 'success') {
      console.log(response.data.payload)
      selectedPosition.checklists = response.data.payload.checklists
    }
    setUpdatingPosition(false)
  }
   
  return (
    <div className="pt-16 bg-gray-100 h-screen overflow-hidden">
      {' '}
      {/* Padding top for the header */}
      {/* {showModal && <AddCandidateModal close={() => setShowModal(false)} />} */}
      <div className="w-full h-full mx-auto">
        <div className="w-full h-full flex">
          <div className="w-1/6 pt-0 mt-0 h-full bg-gray-300 border border-3">
            <Sidebar positions={positions} selectedPosition={selectedPosition} setSelectedPosition={setSelectedPosition} />
          </div>
            { !updatingPosition && selectedPosition &&
              <div className='w-5/6'>
                <div className="w-full">
                  <DashboardHeader selectedPosition={selectedPosition} /> 
                </div>
                <div className="justify-between items-center py-6 px-10 mt-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="w-2/3 sm:rounded-md">
                      <h1 className="text-2xl font-bold text-gray-900 my-4 pl-6">Top Candidates</h1>
                      {selectedPosition.checklists?.length && selectedPosition.checklists[0].candidates.map((candidate, index) => (
                        <ScoreCard key={index} candidate={candidate} />
                      ))}
                    </div>
                    <div className="w-1/3 pt-10 bg-white shadow overflow-hidden sm:rounded-md">
                      <CriteriaBox selectedPosition={selectedPosition} />
                    </div>
                  </div>
                </div>
              </div>
            }
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
