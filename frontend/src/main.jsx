import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import {RouterProvider} from 'react-router-dom';
import { router } from './router.jsx';

import './styles/main.scss';
// import App from './App.jsx';
import { store } from './app/store';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  // </StrictMode>
);