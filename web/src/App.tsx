import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthenticatedLayout, UnAuthenticatedLayout } from './layout';

import {
  AuthenticationPage,
  DashboardPage,
  HomePage,
  SettingsPage,
} from '@/screens';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route element={<UnAuthenticatedLayout />}>
          <Route path="/auth" element={<AuthenticationPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
