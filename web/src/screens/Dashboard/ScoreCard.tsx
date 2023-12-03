import { useState } from 'react';

import { Candidate } from '../../types';

interface ScoreCardProps {
  candidate: Candidate;
}

const ScoreCard = ({ candidate }: ScoreCardProps) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const toggleDetail = () => {
    setShowDetails(!showDetails);
  };

  const DetailPart = () => {
    return (
      <div className="text-xs text-gray-600 m-2">
        {candidate.assessments.map((assessment, index) => (
          <div key={index} className="m-4">
            <p className="text-sm ml-4">
              - {assessment.criterion_message}: {assessment.score} / 10
            </p>
            <p className="text-xs ml-2">{assessment.reason}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex w-full bg-white mb-4 overflow-y-scroll max-h-80">
      <div className="w-5/6">
        <div className="text-2xl font-bold mx-12 my-4">
          {candidate.first_name + ' ' + candidate.last_name}
        </div>
        <p className="text-xs text-gray-600 mx-8 m-2">- {candidate.summary}</p>
        {showDetails && <DetailPart />}
        <button
          className="text-blue-500 hover:text-blue-900 text-xs float-right mb-2"
          onClick={toggleDetail}
        >
          {!showDetails ? 'see detail' : 'close'}
        </button>
      </div>
      <div className="w-1/6">
        <div className="text-3xl font-bold m-6">
          {candidate.total_score.toFixed(1)}
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
