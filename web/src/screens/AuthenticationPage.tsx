import { useState } from 'react';

import { clientEndpoint, githubClientId } from '@/config/env';
import { AuthenticationPageTemplate } from '@/template';

const AuthenticationPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGithubLogin = () => {
    setIsLoading(true);
    const redirectUri = `${clientEndpoint}/auth/github/callback`;
    const loginUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=repo,user`;

    window.location.href = loginUrl;
  };

  return (
    <AuthenticationPageTemplate
      isLoading={isLoading}
      onGithubLogin={handleGithubLogin}
    />
  );
};

export default AuthenticationPage;
