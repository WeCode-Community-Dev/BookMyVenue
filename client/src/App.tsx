import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { useAppStore } from './store/app.store';

export default function App() {
  const hasHydrated = useAppStore((state) => state._hasHydrated);

  if (!hasHydrated) return null;

  return <RouterProvider router={router} />;
}
