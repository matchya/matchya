import { useState } from 'react';
import { IoMdRefresh } from 'react-icons/io';

import { Loading } from '../../../components/Button';
import ToastMessage from '../../../components/ToastMessage';
import { axiosInstance } from '../../../helper';
import { useCompanyStore } from '../../../store/useCompanyStore';
import { Position } from '../../../types';

interface ScheduledCriteriaBoxProps {
  message: string;
  messageType: 'error' | 'success';
  setMessage: (message: string) => void;
  setMessageType: (messageType: 'error' | 'success') => void;
}

const ScheduledCriteriaBox = ({
  message,
  messageType,
  setMessage,
  setMessageType,
}: ScheduledCriteriaBoxProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedPosition, selectPosition, setSelectedPositionDetail } =
    useCompanyStore();

  const handleRefresh = async () => {
    if (!selectedPosition) return;
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/positions/status/${selectedPosition?.id}`
      );
      if (response.data.status == 'success') {
        const status: string = response.data.payload.checklist_status;
        if (status === 'succeeded') {
          const pos: Position | null = await setSelectedPositionDetail();
          if (pos) selectPosition(pos);
          // window.location.reload();
        } else if (status === 'failed') {
          setMessageType('error');
          setMessage('Criteria generation failed. Please try again.');
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="px-6 py-4">
      <div className="flex items-center">
        {message && <ToastMessage message={message} type={messageType} />}
        <h3 className="text-2xl font-bold mx-10">Generated Criteria</h3>
        <button
          className="border border-2 border-black rounded py-1 px-3 hover:bg-gray-200 active:bg-gray-300"
          onClick={handleRefresh}
        >
          <IoMdRefresh size={30} />
        </button>
      </div>
      {isLoading ? (
        <div className="my-5 flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <div className="">
          <p className="text-sm text-gray-600 mt-4">
            Criteria generation is scheduled. It may take a few minutes to
            finish.
          </p>
        </div>
      )}
    </div>
  );
};

export default ScheduledCriteriaBox;
