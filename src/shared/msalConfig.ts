// MSAL configuration for Microsoft Entra ID (External ID)
import { Configuration } from '@azure/msal-browser';

const clientId = process.env.EXPO_PUBLIC_MSAL_CLIENT_ID || '';
const authority = process.env.EXPO_PUBLIC_MSAL_AUTHORITY || '';
const redirectUri = process.env.EXPO_PUBLIC_MSAL_REDIRECT_URI || '';

if (typeof window !== 'undefined') {
  if (!clientId) console.error('[MSAL Config] Missing EXPO_PUBLIC_MSAL_CLIENT_ID');
  if (!authority) console.error('[MSAL Config] Missing EXPO_PUBLIC_MSAL_AUTHORITY');
}

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority,
    redirectUri: typeof window !== 'undefined' && window.location && window.location.origin
      ? window.location.origin
      : redirectUri,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};
