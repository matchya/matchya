import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { axiosInstance } from '@/lib/axios';
import { OAuthCallbackPageTemplate } from '@/template';

const GoogleAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loginFailed, setLoginFailed] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(location.hash).get('#access_token');
    if (token) {
      googleLogin(token);
    }
  }, [location]);

  const googleLogin = async (token: string) => {
    try {
      const response = await axiosInstance.post('/login/google', { token });
      if (response.data.status === 'success') {
        navigate('/assessments');
      }
    } catch (error) {
      setLoginFailed(true);
      setTimeout(() => {
        setLoginFailed(false);
        navigate('/auth');
      }, 5000);
    }
  };

  const handleRetryLogin = () => navigate('/auth');

  return (
    <OAuthCallbackPageTemplate
      isLoginFailed={loginFailed}
      onRetryLogin={handleRetryLogin}
      authType="Google"
    />
  );
};

export default GoogleAuthCallback;
