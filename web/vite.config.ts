import path from 'path';

import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const plugins = [react()];

if (
  [
    'tsc && vite build --mode staging',
    'tsc && vite build --mode production',
  ].includes(process.env.npm_lifecycle_script)
) {
  plugins.push(
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    })
  );
}

export default defineConfig({
  define: {
    'import.meta.env.NPM_PACKAGE_VERSION': JSON.stringify(
      process.env.npm_package_version
    ),
    'import.meta.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN),
    'import.meta.env.SENTRY_ENVIRONMENT': JSON.stringify(
      process.env.SENTRY_ENVIRONMENT
    ),
    'import.meta.env.RUDDERSTACK_WRITE_KEY': JSON.stringify(
      process.env.RUDDERSTACK_WRITE_KEY
    ),
    'import.meta.env.RUDDERSTACK_DATA_PLANE_URL': JSON.stringify(
      process.env.RUDDERSTACK_DATA_PLANE_URL
    ),
  },
  plugins,
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
  },
});
