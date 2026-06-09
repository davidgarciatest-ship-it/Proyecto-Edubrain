const DEV_API_URL = 'http://192.168.0.129:3001/api';
const PROD_API_URL = 'https://edubrain-backend.onrender.com/api';

export const API_BASE =
  process.env.EXPO_PUBLIC_API_URL ??
  (process.env.NODE_ENV === 'production' ? PROD_API_URL : DEV_API_URL);
