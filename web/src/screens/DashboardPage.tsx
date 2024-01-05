import { useEffect } from 'react';

import { usePositionStore } from '@/store/store';
import { DashboardPageTemplate, PositionSetupPageTemplate } from '@/template';

const DashboardPage = () => {
  const { selectedPosition, positions, selectedCandidate, selectCandidate } =
    usePositionStore();

  useEffect(() => {
    if (
      selectedPosition &&
      selectedPosition.candidates &&
      selectedPosition?.candidates.find(c => c.id === selectedCandidate?.id)
    ) {
      return;
    }
    if (selectedPosition?.checklist && selectedPosition.candidates) {
      selectCandidate(selectedPosition.candidates[0]);
    }
  }, [selectedPosition]);

  if (!selectedPosition && positions.length > 0) {
    return <div>loading...</div>;
  }

  if (!selectedPosition) {
    return <PositionSetupPageTemplate />;
  }

  return (
    <DashboardPageTemplate
      positions={positions}
      selectedPosition={selectedPosition}
      selectedCandidate={selectedCandidate}
    />
  );
};

export default DashboardPage;
