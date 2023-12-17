import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Icons } from '../../components/ui/Icons/Icons';

import { Button } from '@/components/ui/Button/Button';
import { axiosInstance } from '@/helper';

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

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center mb-5">
        {!loginFailed && (
          <Icons.spinner className="mb-3 h-10 w-10 animate-spin" />
        )}
        <p className="text-xl">
          {!loginFailed ? 'Logging in with GitHub...' : 'Login with GitHub Failed. Please try again.'}
        </p>
        {loginFailed && (
          <Button
            variant="outline"
            className="mt-5 h-12 text-xl bg-black text-white"
            onClick={() => navigate('/auth')}
          >
            Retry Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default GithubAuthCallback;
