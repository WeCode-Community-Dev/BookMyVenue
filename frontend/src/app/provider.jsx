import { Provider } from 'react-redux';
import { Toaster } from 'sonner';

import { store } from '@/app/store';
import { AuthSession } from '@/features/auth/components/auth-session';

export function AppProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthSession />
      {children}
      <Toaster position="top-right" richColors closeButton />
    </Provider>
  );
}
