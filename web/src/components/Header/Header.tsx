import { useNavigate } from 'react-router-dom';

import {
  Avatar,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  MainNav,
  PositionSwitcher,
  UserNavDropdownMenu,
} from '@/components';
import { axiosInstance } from '@/lib/client';
import { useCompanyStore, usePositionStore } from '@/store/store';

interface HeaderProps {
  authenticated: boolean;
}

export const Header = ({ authenticated }: HeaderProps) => {
  const navigate = useNavigate();
  const { resetAll, name, email } = useCompanyStore();
  const { positions, selectedPosition, selectPosition } = usePositionStore();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout');
      resetAll();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const abbreviateName = () => {
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0);
    } else {
      return nameParts[0].charAt(0) + nameParts[1].charAt(0);
    }
  };

  if (!authenticated && !name) {
    return (
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="ml-auto mr-6 flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        {selectedPosition && authenticated && (
          <PositionSwitcher
            positions={positions}
            selectedPosition={selectedPosition}
            selectPosition={selectPosition}
          />
        )}
        {authenticated && <MainNav className="mx-6" />}
        <div className="ml-auto flex items-center space-x-4">
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
