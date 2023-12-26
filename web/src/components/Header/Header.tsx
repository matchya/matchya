import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Link } from 'react-router-dom';

import matchyaIcon from '/matchya-icon.png';

import { axiosInstance } from '../../helper';

import { useCompanyStore } from '@/store/store';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, resetAll, me } = useCompanyStore();

  useEffect(() => {
    if (id) return;
    if (location.pathname === '/login' || location.pathname === '/') return;
    getAuthStatus();
  }, [location.pathname]);

  const getAuthStatus = async () => {
    try {
      await me();
    } catch (error) {
      navigate('/auth');
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

  return (
    <div className="w-full h-16 absolute bg-white border-2 flex justify-between">
      <div className="w-1/5 flex justify-center items-center">
        <img className="h-3/4 rounded-full m-6" src={matchyaIcon} />
        <Link to="/">
          <h3 className="text-lg m-6">Matchya</h3>
        </Link>
      </div>
      <div className="w-1/4 flex justify-end items-center">
        {id ? (
          <>
            <Link to="/settings">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-6">
                Settings
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-6">
                Dashboard
              </button>
            </Link>
          </>
        ) : null}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-6"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
