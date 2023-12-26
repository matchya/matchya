import axios from 'axios';

import { apiEndpoint } from '../config';

const commonConfig = {
  baseURL: apiEndpoint,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 *
 * This is the common configuration for axios instances used in the application.
 * It sets the base URL to the API endpoint and sets the content type of requests to 'application/json'.
 */
export const axiosInstance = axios.create({
  ...commonConfig,
  withCredentials: true,
});
