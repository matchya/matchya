import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Header } from '@/components/ui/Header/Header';
import { useCompanyStore } from '@/store/useCompanyStore';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, me } = useCompanyStore();

  useEffect(() => {
    if (id) return;
    getAuthStatus();
  }, [location.pathname]);

  const getAuthStatus = async () => {
    try {
      await me();
    } catch (error) {
      navigateToAuth();
    }
  };

  const navigateToAuth = () => {
    navigate('/auth');
  };

  return (
    <>
      <Header authenticated={true} />
      <Outlet />
    </>
  );
};

export default Layout;
