import { useState } from 'react';

import Button from '../../components/Button';

import AddCandidateModal from './AddCandidateModal';

import { usePositionStore } from '@/store/usePositionStore';

const DashboardHeader = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { selectedPosition } = usePositionStore();

  const handleModalDisplay = () => {
    setShowModal(true);
  };

  return (
    <div className="w-full flex justify-between items-center py-4 bg-gray-500">
      {showModal && <AddCandidateModal close={() => setShowModal(false)} />}
      {selectedPosition?.checklist && (
          <Button
            text="Add candidate"
            color="green"
            outline={false}
            className="mr-24 px-6 py-4 text-xl mb-0 mt-0"
            onClick={handleModalDisplay}
          />
        )}
    </div>
  );
};

export default DashboardHeader;
