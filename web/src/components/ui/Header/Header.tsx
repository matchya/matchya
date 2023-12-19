import { Avatar } from '../Avatar/Avatar';
import { Button } from '../Button/Button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '../DropdownMenu/DropdownMenu';
import { UserNavDropdownMenu } from '../DropdownMenu/UserNavDropdownMenu/UserNavDropdownMenu';
import { PositionSwitcher } from '../PositionSwitcher/PositionSwitcher';

import { MainNav } from '@/components/ui/MainNav/MainNav';
import { Position } from '@/types';

interface HeaderProps {
  abbreviatedName: string;
  companyName: string;
  email: string;
  handleLogout: () => void;
  positions: Position[];
  selectPosition: (position: Position) => void;
  selectedPosition: Position;
}

export const Header = ({
  abbreviatedName,
  companyName,
  email,
  handleLogout,
  positions,
  selectPosition,
  selectedPosition,
}: HeaderProps) => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <PositionSwitcher
          positions={positions}
          selectedPosition={selectedPosition}
          selectPosition={selectPosition}
        />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar altName={abbreviatedName} />
              </Button>
            </DropdownMenuTrigger>
            <UserNavDropdownMenu
              companyName={companyName}
              companyEmail={email}
              onLogout={handleLogout}
            />
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
