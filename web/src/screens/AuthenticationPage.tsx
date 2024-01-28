import { useState } from 'react';

import { clientEndpoint, googleClientId } from '@/config/env';
import { trackEvent } from '@/lib/rudderstack';
import { AuthenticationPageTemplate } from '@/template';

const AuthenticationPage = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const handleGoogleLogin = () => {
    trackEvent({ eventName: 'attempt_google_login' });
    setIsGoogleLoading(true);
    const redirectUri = `${clientEndpoint}/auth/google/callback`;
    const scope =
      'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
    const loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;

    window.location.href = loginUrl;
  };

  return (
    <AuthenticationPageTemplate
      isGoogleLoading={isGoogleLoading}
      onGoogleLogin={handleGoogleLogin}
    />
  );
};

export default AuthenticationPage;
