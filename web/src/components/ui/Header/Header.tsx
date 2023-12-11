import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';

import { Button } from '@/components/ui/Button/Button';
import { MainNav } from '@/components/ui/MainNav/MainNav';
import { UserNav } from '@/components/ui/UserNav/UserNav';
import { axiosInstance } from '@/helper';
import { useCompanyStore } from '@/store/useCompanyStore';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, resetAll, me } = useCompanyStore();

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

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        {/* <TeamSwitcher /> */}
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          {/* <Search /> */}
          {id ? (
            <UserNav onLogout={handleLogout} />
          ) : (
            <Button onClick={navigateToAuth}>Log in</Button>
          )}
        </div>
      </div>
    </div>
  );
};
