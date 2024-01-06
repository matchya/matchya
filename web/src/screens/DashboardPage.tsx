import { useEffect, useState } from 'react';

import { axiosInstance } from '@/lib/client';
import { useCompanyStore, usePositionStore } from '@/store/store';
import { DashboardPageTemplate, PositionSetupPageTemplate } from '@/template';

const DashboardPage = () => {
  const { selectedPosition, positions, selectedCandidate, selectCandidate } =
    usePositionStore();

  const { id, me } = useCompanyStore();
  const [type, setType] = useState('default');
  const [level, setLevel] = useState('default');

  const handleSelectType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
  };

  const handleSelectLevel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLevel(e.target.value);
  };

  const handleSubmit = async () => {
    console.log(type, level);
    const data = {
      company_id: id,
      type: type,
      level: level,
    };
    try {
      const res = await axiosInstance.post('/positions', data);
      if (res.data.status === 'success') {
        me();
      }
    } catch (err) {
      console.log(err);
    }
  };

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
    return (
      <PositionSetupPageTemplate
        type={type}
        level={level}
        handleSelectType={handleSelectType}
        handleSelectLevel={handleSelectLevel}
        handleSubmit={handleSubmit}
      />
    );
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
