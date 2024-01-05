import { useState } from 'react';

import { clientEndpoint, githubClientId, googleClientId } from '@/config/env';
import { AuthenticationPageTemplate } from '@/template';

const AuthenticationPage = () => {
  const [isGitHubLoading, setIsGitHubLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const handleGithubLogin = () => {
    setIsGitHubLoading(true);
    const redirectUri = `${clientEndpoint}/auth/github/callback`;
    const loginUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=repo,user`;

    window.location.href = loginUrl;
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    // const redirectUri = `${clientEndpoint}/auth/google/callback`;
    const redirectUri = 'http://127.0.0.1:5173/auth/google/callback';
    const loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=token&scope=openid%20email%20profile`;

    window.location.href = loginUrl;
  };

  return (
    <AuthenticationPageTemplate
      isGitHubLoading={isGitHubLoading}
      isGoogleLoading={isGoogleLoading}
      onGithubLogin={handleGithubLogin}
      onGoogleLogin={handleGoogleLogin}
    />
  );
};

export default AuthenticationPage;
