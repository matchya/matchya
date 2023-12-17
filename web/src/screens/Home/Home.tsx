import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useCompanyStore } from '@/store/useCompanyStore';

function Home() {
  const { id, me } = useCompanyStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) return;
    if (location.pathname === '/auth' || location.pathname === '/') return;
    getAuthStatus();
  }, [location.pathname]);

  const getAuthStatus = async () => {
    try {
      await me();
    } catch (error) {
      console.log('ERROR: ', error);
      navigate('/auth');
    }
  };

  return <div>Home</div>;
}

export default Home;
