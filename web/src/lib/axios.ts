import axios from 'axios';
import { snakeCase, camelCase } from 'change-case';

import { convertKeys } from './utils';

import { apiEndpoint } from '@/config/env';

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
const caseSensitiveAxiosInstance = axios.create({
  ...commonConfig,
  withCredentials: true,
});

// Add a request interceptor
// This interceptor converts the keys of the request data to snake case.
caseSensitiveAxiosInstance.interceptors.request.use(config => {
  if (config.data) {
    config.data = convertKeys(config.data, snakeCase);
  }
  return config;
});

// Add a response interceptor
// This interceptor converts the keys of the response data to camel case.
caseSensitiveAxiosInstance.interceptors.response.use(response => {
  if (response.data) {
    if (response.data.payload) {
      response.data.payload = convertKeys(response.data.payload, camelCase);
    }
  }
  return response;
});

const axiosInstance = axios.create({
  ...commonConfig,
  withCredentials: true,
});

export { axiosInstance, caseSensitiveAxiosInstance };
