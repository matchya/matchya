import axios from "axios";

import { apiEndpoint } from "../config";

const commonConfig = {
  baseURL: apiEndpoint,
  headers: {
    'Content-Type': 'application/json'
  }
}

export const protectedAxios = axios.create({
  ...commonConfig,
  withCredentials: true
})

export const unprotectedAxios = axios.create({
  ...commonConfig
})
