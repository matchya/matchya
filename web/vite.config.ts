import path from 'path';

import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const plugins = [react()];

if (process.env.npm_lifecycle_event === 'tsc && vite build') {
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
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(
      process.env.npm_package_version
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
