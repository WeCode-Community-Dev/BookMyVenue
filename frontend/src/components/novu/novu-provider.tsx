import type { ReactNode } from 'react';

import { NovuProvider as NovuReactProvider } from '@novu/react';

import { useAuth } from 'src/context/auth/use-auth';

// ----------------------------------------------------------------------

const NOVU_APPLICATION_IDENTIFIER = import.meta.env.VITE_NOVU_APPLICATION_IDENTIFIER;

type NovuProviderProps = {
  children: ReactNode;
};

/**
 * Bridges the app's auth state with Novu's notification feed, keyed off the
 * signed-in user's id as the Novu `subscriberId`.
 */
export function NovuProvider({ children }: NovuProviderProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user || !NOVU_APPLICATION_IDENTIFIER) {
    return <>{children}</>;
  }

  return (
    <NovuReactProvider
      applicationIdentifier={NOVU_APPLICATION_IDENTIFIER}
      subscriberId={user.id}
    // subscriberId={'6a4a7c53860a3d9235078de4'}
    // subscriberId={'6a4a7c53860a3d9235078de4'}
    >
      {children}
    </NovuReactProvider>
  );
}

// curl -X POST "https://api.novu.co/v1/events/trigger" \
//   -H "Authorization: ApiKey f5106da845af1db23a15f253d7db10ec" \
//   -H "Content-Type: application/json" \
//   -d '{
//   "name": "generic-in-app-notification",
//   "to": {
//     "subscriberId": "6a4a7c53860a3d9235078de4",
//     "firstName": "Mohammed",
//     "lastName": "Shahul pm",
//     "email": "mshahulpm@gmail.com"
//   },
//   "payload": {
//     "title": "Booking success",
//     "message": "Your bookig at casa da papel has been confirmed",
//     "actionUrl": "https://example.com",
//     "avatarUrl": "https://example.com",
//     "actionLabel": "example text",
//     "__source": "dashboard"
//   }
// }'