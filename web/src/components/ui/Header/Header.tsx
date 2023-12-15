import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';

import { Avatar } from '../Avatar/Avatar';
import { Button } from '../Button/Button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '../DropdownMenu/DropdownMenu';
import { UserNavDropdownMenu } from '../DropdownMenu/UserNavDropdownMenu/UserNavDropdownMenu';
import { PositionSwitcher } from '../PositionSwitcher/PositionSwitcher';

import { MainNav } from '@/components/ui/MainNav/MainNav';
import { axiosInstance } from '@/helper';
import { useCompanyStore } from '@/store/useCompanyStore';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, resetAll, name, email } = useCompanyStore();

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
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <PositionSwitcher />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          {/* <Search /> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar altName={abbreviateName()} />
              </Button>
            </DropdownMenuTrigger>
            <UserNavDropdownMenu
              companyName={name}
              companyEmail={email}
              onLogout={handleLogout}
            />
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
