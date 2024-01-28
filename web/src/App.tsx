import { BrowserRouter as Router, Route } from 'react-router-dom';

import SentryRoutes from './lib/sentry';
import { StoreProvider } from './store';

import AuthenticatedLayout from '@/layout/Authenticated';
import UnAuthenticatedLayout from '@/layout/UnAuthenticated';
import AssessmentDetailPage from '@/screens/AssessmentDetailPage';
import AssessmentsPage from '@/screens/AssessmentsPage';
import AuthenticationPage from '@/screens/AuthenticationPage';
import CandidatesPage from '@/screens/CandidatesPage';
import CreateAssessmentPage from '@/screens/CreateAssessmentPage';
import GoogleAuthCallbackPage from '@/screens/GoogleAuthCallbackPage';
import HomePage from '@/screens/HomePage';
import InterviewDetailPage from '@/screens/InterviewDetailPage';
import InterviewRecordingPage from '@/screens/InterviewRecordingPage';
import InterviewsPage from '@/screens/InterviewsPage';
import OnboardingPage from '@/screens/OnboardingPage';

function App() {
  return (
    <StoreProvider>
      <Router>
        <SentryRoutes>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/interviews" element={<InterviewsPage />} />
            <Route path="/interviews/:id" element={<InterviewDetailPage />} />
            <Route path="/assessments" element={<AssessmentsPage />} />
            <Route
              path="/assessments/create"
              element={<CreateAssessmentPage />}
            />
            <Route path="/assessments/:id" element={<AssessmentDetailPage />} />
          </Route>
          <Route element={<UnAuthenticatedLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthenticationPage />} />
            <Route
              path="/auth/google/callback"
              element={<GoogleAuthCallbackPage />}
            />
            <Route
              path="/interviews/:id/record"
              element={<InterviewRecordingPage />}
            />
          </Route>
        </SentryRoutes>
      </Router>
    </StoreProvider>
  );
}

export default App;
