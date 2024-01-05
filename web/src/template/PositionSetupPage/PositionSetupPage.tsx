import { useState } from 'react';

import { Button } from '@/components';
import { axiosInstance } from '@/lib/client';
import { useCompanyStore } from '@/store/store';

const PositionSetupPage = () => {
  const { id, me } = useCompanyStore();
  const [type, setType] = useState('default');
  const [level, setLevel] = useState('default');

  const handleSelectType = e => {
    setType(e.target.value);
  };

  const handleSelectLevel = e => {
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

  return (
    <div className="bg-gray-100 h-[calc(100vh-64px)] overflow-hidden">
      <div className="w-full h-full mx-auto">
        <p className="text-2xl font-bold text-center">Position Setup</p>
        <select className="" value={type} onChange={handleSelectType}>
          <option value="default">Default</option>
          <option value="frontend">Front-end</option>
          <option value="backend">Back-end</option>
          <option value="devops">DevOps</option>
          <option value="fullstack">Full-stack</option>
        </select>
        <select className="" value={level} onChange={handleSelectLevel}>
          <option value="default">Default</option>
          <option value="entry">Entry-level</option>
          <option value="mid">Mid-level</option>
          <option value="senior">Senior-level</option>
        </select>
        <Button
          className="w-24 h-12 mx-auto text-white bg-blue-500 rounded-md"
          onClick={handleSubmit}
        >
          Add Position
        </Button>
      </div>
    </div>
  );
};

export default PositionSetupPage;
