import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/react";
import { Toaster } from "sonner";

import App from "./App";
import "./index.css";

import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./context/AuthContext";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (import.meta.env.DEV) {
  console.log(`[AUTH DEBUG] app mounted at ${(performance.now()).toFixed(2)} ms`);
}

if (!PUBLISHABLE_KEY) {
  console.warn(
    "Missing VITE_CLERK_PUBLISHABLE_KEY environment variable. Clerk Authentication features require a valid publishable key."
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY || ""}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <App />
            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={3000}
            />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ClerkProvider>
  </React.StrictMode>
);