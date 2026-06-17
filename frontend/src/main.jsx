import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import {RouterProvider} from 'react-router-dom';
import { router } from './router.jsx';

import './styles/main.scss';
import { store } from './app/store';
import { AppToaster } from './components/ui/ToastProvider';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <AppToaster />
      <RouterProvider router={router} />
    </Provider>
  // </StrictMode>
);