import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import matchyaIcon from '/matchya-icon.png';

import { useCompanyStore } from '../../store/useCompanyStore';

const Header = () => {
  const navigate = useNavigate();
  const { id, resetAll } = useCompanyStore();

  const logout = () => {
    // TODO: Updating cokkie is not working
    // Need to do something on backend!
    document.cookie =
      'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    resetAll();
    navigate('/');
  };

  const navigateToSettings = () => {
    navigate('/settings');
  };

  const navigateToLogin = () => {
    navigate('/login');
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
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-6"
            onClick={navigateToSettings}
          >
            Settings
          </button>
        ) : null}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-6"
          onClick={id ? logout : navigateToLogin}
        >
          {id ? 'Logout' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default Header;
