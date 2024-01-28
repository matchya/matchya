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
