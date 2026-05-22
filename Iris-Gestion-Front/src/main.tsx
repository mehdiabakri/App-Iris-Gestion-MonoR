import { createRoot } from "react-dom/client";
import { Box, ChakraProvider } from "@chakra-ui/react";

import App from "./App.tsx";
import theme from "./theme/theme.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

// Initialisation de React Query
const queryClient = new QueryClient();

// La fonction mode Démo (MSW)
async function enableMocking() {
  const isDemoMode = localStorage.getItem("isDemoMode") === "true";
  if (!isDemoMode) return;

  const { worker } = await import("./mocks/browser");

  return worker.start({
    // On demande à MSW d'ignorer tout ce qui n'est pas une requête API
    onUnhandledRequest: "bypass",
    waitUntilReady: true,
    serviceWorker: {
      url: "/mockServiceWorker.js",
    },
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <Box minH="100vh" w="100% "> 
              <AuthProvider>
                <App />
              </AuthProvider>
            </Box>
          </QueryClientProvider>
        </ChakraProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
});
