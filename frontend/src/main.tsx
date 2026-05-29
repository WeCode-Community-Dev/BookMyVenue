import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

// TODO: Wrap App with QueryClientProvider when implementing React Query
const _queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
