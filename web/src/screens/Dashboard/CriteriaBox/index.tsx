import { useState } from 'react';

import { useCompanyStore } from '../../../store/useCompanyStore';
import { Criterion } from '../../../types';

import GenerateCriteriaBox from './GenerateCriteraBox';
import ScheduledCriteriaBox from './ScheduledCriteriaBox';

const CriteriaBox = () => {
  const { selectedPosition } = useCompanyStore();
  const [generationDone, setGenerationDone] = useState(false);

  const LoadingCriteriaBox = () => {
    return <div>loading...</div>;
  };

  const GeneratedCriteriaBox = () => {
    return (
      <div className="px-6 py-4">
        <h3 className="text-lg font-bold">Generated Criteria</h3>
        <ul className="list-disc pl-6 mt-4">
          {selectedPosition?.checklists[0].criteria.map(
            (criterion: Criterion) => (
              <li key={criterion.id} className="text-sm text-gray-600">
                {criterion.message}
              </li>
            )
          )}
        </ul>
      </div>
    );
  };

  if (generationDone) {
    return <GeneratedCriteriaBox />;
  }

  if (!selectedPosition) {
    return <LoadingCriteriaBox />;
  } else if (selectedPosition.checklist_status === 'scheduled') {
    return <ScheduledCriteriaBox setGenerationDone={setGenerationDone} />;
  } else if (selectedPosition.checklist_status === 'succeeded') {
    return <GeneratedCriteriaBox />;
  } else {
    return <GenerateCriteriaBox />;
  }
};

export default CriteriaBox;
