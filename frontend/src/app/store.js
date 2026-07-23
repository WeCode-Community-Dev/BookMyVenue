import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/features/auth/stores/auth-slice';
import { baseApi } from '@/lib/api';

// Side-effect imports: register RTK Query endpoints on baseApi
import '@/features/auth/api/auth-api';
import '@/features/venues/api/venues-api';
import '@/features/bookings/api/bookings-api';
import '@/features/owner/api/owner-api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});
