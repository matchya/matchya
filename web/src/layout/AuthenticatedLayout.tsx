import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Header } from '@/components/ui/Header/Header';
import { axiosInstance } from '@/helper';
import { useCompanyStore } from '@/store/useCompanyStore';
import { usePositionStore } from '@/store/usePositionStore';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, resetAll, me, name, email } = useCompanyStore();
  const { positions, selectedPosition, selectPosition } = usePositionStore();

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

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout');
      resetAll();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const navigateToAuth = () => {
    navigate('/auth');
  };

  const abbreviateName = () => {
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0);
    } else {
      return nameParts[0].charAt(0) + nameParts[1].charAt(0);
    }
  };

  return (
    <>
      <Header
        abbreviatedName={abbreviateName()}
        companyName={name}
        email={email}
        handleLogout={handleLogout}
        positions={positions}
        selectPosition={selectPosition}
        selectedPosition={selectedPosition}
      />
      <Outlet />
    </>
  );
};

export default Layout;
