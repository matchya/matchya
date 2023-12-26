import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { axiosInstance } from '@/lib/client';
import { GithubAuthCallbackPageTemplate } from '@/template';

const GithubAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loginFailed, setLoginFailed] = useState(false);

  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code');
    if (code) {
      handleGithubLogin(code);
    }
  }, [location]);

  const handleGithubLogin = async (code: string) => {
    try {
      const response = await axiosInstance.post('/github', { code });

      if (response.data.status === 'success') {
        navigate('/dashboard');
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
    <GithubAuthCallbackPageTemplate
      isLoginFailed={loginFailed}
      onRetryLogin={handleRetryLogin}
    />
  );
};

export default GithubAuthCallback;
