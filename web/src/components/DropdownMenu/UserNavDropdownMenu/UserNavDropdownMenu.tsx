import { useNavigate } from 'react-router-dom';

import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../DropdownMenu';

interface UserNavProps {
  companyName?: string;
  companyEmail?: string;
  onLogout: () => void;
}

const UserNavDropdownMenu = ({
  companyName = 'shadcn',
  companyEmail = 'me@example.com',
  onLogout,
}: UserNavProps) => {
  const navigate = useNavigate();
  const navigateToSettingsPage = () => navigate('/settings');
  const navigateToDashboardPage = () => navigate('/dashboard');
  return (
    <DropdownMenuContent className="w-56" align="end" forceMount>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{companyName}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {companyEmail}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem onClick={navigateToDashboardPage}>
          Dashboard
          {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={navigateToSettingsPage}>
          Settings
          {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onLogout}>Log out</DropdownMenuItem>
    </DropdownMenuContent>
  );
};

export default UserNavDropdownMenu;
