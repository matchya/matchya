import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import matchyaIcon from '/matchya-icon.png';

import { apiEndpoint } from '../../config';
import AuthModal, { LoginInput, RegisterInput } from '../LoginModal/AuthModal';

const Header = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authenticationType, setAuthenticationType] = useState<
    'signup' | 'login'
  >('login');

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

  const handleLogin = () => {
    // handle login logic here...
    setShowLoginModal(false);
    setIsAuthenticated(true);
  };

  const handleRegister = async (userData: LoginInput | RegisterInput) => {
    try {
      const response = await axios.post(`${apiEndpoint}/register`, userData);
      if (response.data.status == 'success') {
        setIsAuthenticated(true);
        // TODO: We need logic to set the access token in the global state
        setShowLoginModal(false);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle error (e.g., show error message to the user)
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
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
        {isAuthenticated && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-6"
            onClick={navigateToSettings}
          >
            Settings
          </button>
        )}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-6"
          onClick={isAuthenticated ? logout : showLoginModalHandler}
        >
          {isAuthenticated ? 'Logout' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default Header;
