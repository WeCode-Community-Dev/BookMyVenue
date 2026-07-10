import './check-env'
import 'src/global.css';

import { useEffect } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { usePathname } from 'src/routes/hooks';

import { ThemeProvider } from 'src/theme/theme-provider';

import { NovuProvider } from 'src/components/novu/novu-provider';

import { AuthProvider } from './context/auth/auth-provider';

// ----------------------------------------------------------------------

const queryClient = new QueryClient()

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  useScrollToTop();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NovuProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </NovuProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
