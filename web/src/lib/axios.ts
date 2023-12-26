import axios from 'axios';

import { apiEndpoint } from '../config';

const commonConfig = {
  baseURL: apiEndpoint,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const axiosInstance = axios.create({
  ...commonConfig,
  withCredentials: true,
});
