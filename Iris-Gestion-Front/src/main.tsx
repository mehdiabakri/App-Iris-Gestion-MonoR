import { createRoot } from "react-dom/client";
import { ChakraProvider, Flex } from "@chakra-ui/react";

import App from "./App.tsx";
import theme from "./theme/theme.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Flex
            direction="column"
            minH="100vh"
            justifyContent="center"
            alignItems="center"
          >
            <AuthProvider>
              <App />
            </AuthProvider>
            
          </Flex>
        </QueryClientProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
