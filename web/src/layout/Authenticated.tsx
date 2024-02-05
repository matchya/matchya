import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Header } from '@/components';
import { useCompanyStore } from '@/store/store';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, me } = useCompanyStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(false);
      return;
    }
    getAuthStatus();
  }, [location.pathname]);

  const getAuthStatus = async () => {
    try {
      await me();
      setLoading(false);
    } catch (error) {
      console.log(error);
      navigateToAuth();
    }
  };

  const navigateToAuth = () => {
    navigate('/auth');
  };

  if (loading) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  return (
    <>
      <Header />
      <div className="mx-auto max-w-[1280px]">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
