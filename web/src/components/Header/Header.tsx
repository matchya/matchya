import { Link, useNavigate } from 'react-router-dom';

import {
  Avatar,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  MainNav,
  UserNavDropdownMenu,
} from '@/components';
import { env } from '@/config';
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
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link to="/dashboard">
          <div className="h-full flex items-center cursor-pointer">
            <img
              src={`${env.assetsEndpoint}/Matchya-sticker.png`}
              alt="logo"
              className="mx-12 w-auto h-12 relative mb-1"
            />
            {/* <h1 className="text-xl font-bold text-black">Matchya</h1> */}
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
