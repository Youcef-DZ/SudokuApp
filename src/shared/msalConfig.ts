// MSAL configuration for Microsoft Entra ID (External ID)
import { Configuration } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.EXPO_PUBLIC_MSAL_CLIENT_ID || '',
    authority: process.env.EXPO_PUBLIC_MSAL_AUTHORITY || '',
    redirectUri: typeof window !== 'undefined' && window.location.origin.includes('localhost')
      ? window.location.origin
      : process.env.EXPO_PUBLIC_MSAL_REDIRECT_URI || '',
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};
