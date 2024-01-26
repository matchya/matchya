import ReactDOM from 'react-dom/client';

import App from './App.tsx';

import './lib/sentry.ts';
import './lib/rudderstack.ts';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
