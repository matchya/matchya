import { useNavigate } from 'react-router-dom';

import Template from '../template/HomePage/HomePage';

function HomePage() {
  const navigate = useNavigate();

  const handleNavigateToAuth = () => {
    navigate('/auth');
  };

  return <Template onNavigateToAuth={handleNavigateToAuth} />;
}

export default HomePage;
