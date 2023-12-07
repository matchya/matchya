import { useState } from 'react';
import { IoMdRefresh } from 'react-icons/io';

import { Loading } from '../../../components/Button';
import { axiosInstance } from '../../../helper';
import { useCompanyStore } from '../../../store/useCompanyStore';

interface ScheduledCriteriaProps {
  setGenerationDone: React.Dispatch<React.SetStateAction<boolean>>;
}

const ScheduledCriteriaBox = ({ setGenerationDone }: ScheduledCriteriaProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedPosition, setSelectedPositionDetail } = useCompanyStore();

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
          await setSelectedPositionDetail();
          setGenerationDone(true)
        } else if (status === 'failed') {
          alert('failed');
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
            generate.
          </p>
        </div>
      )}
    </div>
  );
};

export default ScheduledCriteriaBox;
