import { IoMdRefresh } from 'react-icons/io';

const ScheduledCriteriaBox = () => {
  const handleRefresh = () => {
    console.log('refreshing...');
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
      <p className="text-sm text-gray-600 mt-4">
        Criteria generation is scheduled. It may take a few minutes to generate.
      </p>
    </div>
  );
};

export default ScheduledCriteriaBox;
