import { useEffect, useState } from 'react';

import PositionSetupPage from './PositionSetupPage';

import { usePositionStore } from '@/store/store';
import { DashboardPageTemplate } from '@/template';


const DashboardPage = () => {
  const {
    selectedPosition,
    positions,
    selectedCandidate,
    selectCandidate,
    setupRequired,
  } = usePositionStore();
  const [shouldShowQuestions] = useState(false);

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

  if (setupRequired) {
    window.location.href = '/position-setup';
    return <PositionSetupPage />;
  }

  if (!selectedPosition) {
    return <div>loading...</div>;
  }

  return (
    <DashboardPageTemplate
      shouldShowQuestions={shouldShowQuestions}
      positions={positions}
      selectedPosition={selectedPosition}
      selectedCandidate={selectedCandidate}
    />
  );
};

export default DashboardPage;
