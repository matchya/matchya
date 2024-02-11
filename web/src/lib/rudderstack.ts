import {
  RudderAnalytics,
  ApiCallback,
  ApiObject,
} from '@rudderstack/analytics-js';

let rudderAnalytics: RudderAnalytics;

if (import.meta.env.MODE !== 'development') {
  rudderAnalytics = new RudderAnalytics();
  rudderAnalytics.load(
    import.meta.env.RUDDERSTACK_WRITE_KEY,
    import.meta.env.RUDDERSTACK_DATA_PLANE_URL,
    {}
  );
  window.rudderanalytics = rudderAnalytics;
}

interface RudderStackIdentifyUserInterface {
  userId: string;
  name: string;
  email: string;
}

export const identifyUser = ({
  userId,
  name,
  email,
}: RudderStackIdentifyUserInterface) => {
  if (rudderAnalytics) {
    rudderAnalytics.identify(userId, {
      name,
      email,
    });
  }
};

interface RudderStackTrackInterface {
  eventName: string;
  properties?: ApiCallback | ApiObject | undefined;
  callbackFn?: () => void;
}

export const trackEvent = ({
  eventName,
  properties,
  callbackFn,
}: RudderStackTrackInterface) => {
  if (rudderAnalytics) {
    rudderAnalytics.track(eventName, properties, callbackFn);
  }
};
