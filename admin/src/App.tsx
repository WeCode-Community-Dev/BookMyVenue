import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/queryClient";
import { AppRouter } from "./router";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppRouter />
        <Toaster
          position="top-right"
          containerStyle={{
            top: 32,
            right: 32,
          }}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
