import { useNavigate } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '../Avatar/Avatar';
import { Button } from '../Button/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../DropdownMenu/DropdownMenu';

export interface UserNavProps {
  companyName?: string;
  companyEmail?: string;
  onLogout: () => void;
}

export const UserNav = ({
  companyName = 'shadcn',
  companyEmail = 'me@example.com',
  onLogout,
}: UserNavProps) => {
  const navigate = useNavigate();
  const navigateToSettingsPage = () => navigate('/settings');
  const navigateToDashboardPage = () => navigate('/dashboard');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
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
          {/* <DropdownMenuItem>
      Billing
      <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
    </DropdownMenuItem> */}
          {/* <DropdownMenuItem>
      Settings
      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>New Team</DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          Log out
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
