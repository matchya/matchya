import { useNavigate } from 'react-router-dom';

import Template from '../template/HomePage/HomePage';

function HomePage() {
  const navigate = useNavigate();
  const handleNavigateToAuthentication = () => navigate('/auth');
  return (
    <Template onNavigateToAuthentication={handleNavigateToAuthentication} />
  );
}

export default HomePage;
