import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Header } from '@/components/ui/Header/Header';
import { useCompanyStore } from '@/store/useCompanyStore';

const Layout = () => {
  const location = useLocation();
  const { id, me } = useCompanyStore();

  useEffect(() => {
    if (id) return;
    if (location.pathname === '/auth') return;
    getAuthStatus();
  }, [location.pathname]);

  const getAuthStatus = async () => {
    try {
      await me();
    } catch (error) {
      console.error(error);
    }
  };

  if (location.pathname === '/') {
    return (
      <>
        <Header authenticated={false} />
        <Outlet />
      </>
    );
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default Layout;
