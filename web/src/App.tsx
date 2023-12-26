import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { StoreProvider } from './store';

import AuthenticatedLayout from '@/layout/Authenticated';
import UnAuthenticatedLayout from '@/layout/UnAuthenticated';
import AuthenticationPage from '@/screens/AuthenticationPage';
import DashboardPage from '@/screens/DashboardPage';
import GithubAuthCallbackPage from '@/screens/GithubAuthCallbackPage';
import HomePage from '@/screens/HomePage';
import SettingsPage from '@/screens/SettingsPage';

function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route element={<UnAuthenticatedLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthenticationPage />} />
            <Route
              path="/auth/github/callback"
              element={<GithubAuthCallbackPage />}
            />
          </Route>
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;
