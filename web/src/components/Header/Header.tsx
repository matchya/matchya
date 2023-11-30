import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import matchyaIcon from '/matchya-icon.png';

import { unprotectedAxios } from '../../helper';
import { useAuthStore } from '../../store/useAuthStore';
import AuthModal, { LoginInput, RegisterInput } from '../LoginModal/AuthModal';

const Header = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authenticationType, setAuthenticationType] = useState<'signup' | 'login'>('login');
  const { accessToken, setAccessToken, removeAccessToken } = useAuthStore();

  const handleAuthenticationSwitch = () => {
    if (authenticationType == 'signup') {
      setAuthenticationType('login');
    } else {
      setAuthenticationType('signup');
    }
  };

  const showLoginModalHandler = () => {
    setShowLoginModal(true);
  };

  const handleLogin = async (userData: LoginInput | RegisterInput) => {
    try {
      const response = await unprotectedAxios.post('/login', userData);
      if (response.data.status == 'success') {
        setShowLoginModal(false);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Handle error (e.g., show error message to the user)
    }
  };

  const handleRegister = async (userData: LoginInput | RegisterInput) => {
    try {
      const response = await unprotectedAxios.post('/register', userData);
      if (response.data.status == 'success') {
        setShowLoginModal(false);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle error (e.g., show error message to the user)
    }
  };

  const logout = () => {
    removeAccessToken();
    navigate('/');
  };

  const navigateToSettings = () => {
    // Navigate to the settings page
    navigate('/settings');
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return (
    <div className="w-full h-16 absolute bg-white border-2 flex justify-between">
      {showLoginModal && (
        <AuthModal
          type={authenticationType}
          action={authenticationType == 'login' ? handleLogin : handleRegister}
          close={handleCloseModal}
          switchModal={handleAuthenticationSwitch}
        />
      )}
      <div className="w-1/5 flex justify-center items-center">
        <img className="h-3/4 rounded-full m-6" src={matchyaIcon} />
        <Link to="/">
          <h3 className="text-lg m-6">Matchya</h3>
        </Link>
      </div>
      <div className="w-1/4 flex justify-end items-center">
        {accessToken && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-6"
            onClick={navigateToSettings}
          >
            Settings
          </button>
        )}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-6"
          onClick={accessToken ? logout : showLoginModalHandler}
        >
          {accessToken ? 'Logout' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default Header;
