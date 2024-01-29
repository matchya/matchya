import { Link, useNavigate } from 'react-router-dom';

import matchyaSticker from '@/assets/matchya-sticker.png';
import {
  Avatar,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  MainNav,
  UserNavDropdownMenu,
} from '@/components';
import { axiosInstance } from '@/lib/axios';
import { useCompanyStore } from '@/store/store';

const Header = () => {
  const navigate = useNavigate();
  const { resetAll, name, email } = useCompanyStore();

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

  return (
    <div className="border-b bg-macha-500">
      <div className="flex h-16 items-center px-4">
        <Link to="/dashboard">
          <div className="flex items-center space-x-4 px-4 cursor-pointer">
            <img src={matchyaSticker} alt="logo" className="w-48" />
          </div>
        </Link>
        <div className="pl-8 hidden sm:block">
          <MainNav />
        </div>
        <div className="ml-auto flex items-center space-x-4 hidden sm:block">
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

export default Header;
