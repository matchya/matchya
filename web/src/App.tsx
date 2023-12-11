import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthenticatedLayout, UnAuthenticatedLayout } from './layout';

import Login from '@/screens/Authentication/Authentication';
import Dashboard from '@/screens/Dashboard/Dashboard';
import Settings from '@/screens/Settings/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route element={<UnAuthenticatedLayout />}>
          <Route path="/auth" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
