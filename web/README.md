# Web

## Coding Convention

In our codebase, we follow a specific naming convention for methods that are initiated by user actions. All such methods should be prefixed with 'handle'. This convention helps us to easily distinguish methods that need to be tracked by user behavior monitoring tools such as Mixpanel, Rudderstack, Google Analytics, etc.

For these methods, in order to track the event, we should add the `trackEvent` method (imported from Rudderstack).

For example:

```javascript
import { trackEvent } from 'rudderstack';

handleButtonClick() {
  trackEvent('Button Clicked');
  // logic here
}
```

## Local Environment Setup

Setting up your local environment is simple. Follow these steps:

1. Get the `.env` file from a developer in the team. This file contains the environment variables needed for the application to run. Place this file in the `web` folder.

2. Navigate to the `web` folder:

```sh
cd web
```

Run the following command to start the local development server:

```sh
npm run dev
```

The local development server will start on port 5173. You can access the application by navigating to http://localhost:5173 in your web browser.
