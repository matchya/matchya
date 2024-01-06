import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { axiosInstance } from '@/lib/client';
import { useCompanyStore, usePositionStore } from '@/store/store';
import { PositionSetupPageTemplate } from '@/template';

const PositionSetupPage = () => {
    const navigate = useNavigate();
  const { id, me } = useCompanyStore();
  const { setupPosition } = usePositionStore();
  const [type, setType] = useState('');
  const [level, setLevel] = useState('');

  const handleSelectType = (type: string) => {
    setType(type);
  };

  const handleSelectLevel = (level: string) => {
    setLevel(level);
  };

  const handlePositionSubmit = async () => {
    const data = {
      company_id: id,
      type: type,
      level: level,
    };
    try {
      const res = await axiosInstance.post('/positions', data);
      if (res.data.status === 'success') {
        me();
        setupPosition(false);
        navigate('/dashboard');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <PositionSetupPageTemplate
      selectedType={type}
      selectedLevel={level}
      handleSelectType={handleSelectType}
      handleSelectLevel={handleSelectLevel}
      handleSubmit={handlePositionSubmit}
    />
  );
};

export default PositionSetupPage;
