import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { axiosInstance } from '@/helper';
const GithubAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
      console.error('Github Login Failed: ', error);
      navigate('/auth');
    }
  };

  return <div>Logging in with GitHub...</div>;
};

export default GithubAuthCallback;
