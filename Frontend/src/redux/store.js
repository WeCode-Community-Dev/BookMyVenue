import { configureStore } from "@reduxjs/toolkit";
import {api} from './api/venueApiSlice'
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
export default store;
