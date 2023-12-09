import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Header } from './components/ui/Header/Header';

import Dashboard from '@/screens/Dashboard/Dashboard';
import Login from '@/screens/Login';
import Settings from '@/screens/Settings/Settings';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
