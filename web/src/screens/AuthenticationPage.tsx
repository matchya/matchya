import { useState } from 'react';

import { clientEndpoint, googleClientId } from '@/config/env';
import { AuthenticationPageTemplate } from '@/template';

const AuthenticationPage = () => {
  // const [isGitHubLoading, setIsGitHubLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  // const handleGithubLogin = () => {
  //   setIsGitHubLoading(true);
  //   const redirectUri = `${clientEndpoint}/auth/github/callback`;
  //   const loginUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=repo,user`;

  //   window.location.href = loginUrl;
  // };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    const redirectUri = `${clientEndpoint}/auth/google/callback`;
    const scope =
      'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
    const loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;

    window.location.href = loginUrl;
  };

  return (
    <AuthenticationPageTemplate
      // isGitHubLoading={isGitHubLoading}
      isGoogleLoading={isGoogleLoading}
      // onGithubLogin={handleGithubLogin}
      onGoogleLogin={handleGoogleLogin}
    />
  );
};

export default AuthenticationPage;
