import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
  Routes,
} from 'react-router-dom';

if (import.meta.env.MODE !== 'development') {
  Sentry.init({
    dsn: import.meta.env.SENTRY_DSN,
    environment: import.meta.env.SENTRY_ENVIRONMENT,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: [
          'localhost',
          /^https:\/\/yourserver\.io\/api/,
        ],
      }),
      new Sentry.Replay({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    debug: import.meta.env.MODE === 'staging',
    release: `web@${import.meta.env.NPM_PACKAGE_VERSION}`,
    // Performance Monitoring
    tracesSampleRate: 0.5, //  Capture 100% of the transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

export default Sentry.withSentryReactRouterV6Routing(Routes);
