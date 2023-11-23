import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Home from './screens/Home/Home';
import Settings from './screens/Settings/Settings';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const { initAuth } = useAuthStore();
  
  useEffect(() => {
    initAuth();
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
