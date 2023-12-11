import { Outlet } from 'react-router-dom';

import { Header } from '@/components/ui/Header/Header';

const Layout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default Layout;
