import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { StoreProvider } from './store';

import AuthenticatedLayout from '@/layout/Authenticated';
import UnAuthenticatedLayout from '@/layout/UnAuthenticated';
import AuthenticationPage from '@/screens/AuthenticationPage';
import CandidatesPage from '@/screens/CandidatesPage';
import GithubAuthCallbackPage from '@/screens/GithubAuthCallbackPage';
import GoogleAuthCallbackPage from '@/screens/GoogleAuthCallbackPage';
import HomePage from '@/screens/HomePage';
import OnboardingPage from '@/screens/OnboardingPage';

function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/candidates" element={<CandidatesPage />} />
          </Route>
          <Route element={<UnAuthenticatedLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthenticationPage />} />
            <Route
              path="/auth/github/callback"
              element={<GithubAuthCallbackPage />}
            />
            <Route
              path="/auth/google/callback"
              element={<GoogleAuthCallbackPage />}
            />
          </Route>
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;
