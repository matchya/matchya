import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthenticatedLayout, UnAuthenticatedLayout } from './layout';
import { StoreProvider } from './store';

import {
  AuthenticationPage,
  DashboardPage,
  HomePage,
  SettingsPage,
} from '@/screens';
import GithubAuthCallback from '@/screens/Authentication/GithubAuthCallback';

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
              element={<GithubAuthCallback />}
            />
          </Route>
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;
