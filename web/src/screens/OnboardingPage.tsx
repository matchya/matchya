import { useState } from 'react';

import OnboardingPageTemplate from '@/template/OnboardingPage/OnboardingPage';

const OnboardingPage = () => {
  const [email, setEmail] = useState('');

  const onSubmit = () => {
    alert(email)
  };

  const scrollDown = () => {
    window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <OnboardingPageTemplate
      email={email}
      setEmail={setEmail}
      onSubmit={onSubmit}
      scrollDown={scrollDown}
    />
  );
};

export default OnboardingPage;
