import { useState } from 'react'

import Button from '../../components/LoginModal/Button'

import AddCandidateModal from './AddCandidateModal'

const DashboardHeader = () => {
    const [position, ] = useState<string>('Software Engineer')
    const [showModal, setShowModal] = useState<boolean>(false);

    const handleModalDisplay = () => {
        setShowModal(true);
      };

  return (
    <div className='w-full flex justify-between items-center py-4 bg-gray-500'>
        {showModal && <AddCandidateModal close={() => setShowModal(false)} />}
        <h1 className="text-3xl font-bold text-white ml-16">{position}</h1>
        <Button
            text="Add candidate"
            color="green"
            outline={false}
            className='mr-24 px-6 py-4 text-xl mb-0 mt-0'
            onClick={handleModalDisplay}
        />
    </div>
  )
}

export default DashboardHeader