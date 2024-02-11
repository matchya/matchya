import { useNavigate } from 'react-router-dom';

import Template from '../template/HomePage/HomePage';

import { trackEvent } from '@/lib/rudderstack';

function HomePage() {
  const navigate = useNavigate();
  const handleNavigateToAuthentication = () => {
    trackEvent({ eventName: 'navigate_to_authentication' });
    navigate('/auth');
  };

  return (
    <Template onNavigateToAuthentication={handleNavigateToAuthentication} />
  );
}

export default HomePage;
