import ReactDOM from "react-dom/client";
import React from "react";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import routes from "./router/routes";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./theme/chakraui";
import WalletContextProvider from "./components/wallet/WalletContextProvider";
import { AnchorContextProvider } from "./context/AnchorContextProvider";
import { ArweaveContextProvider } from "./context/ArweaveContextProvider";
import { SearchContextProvider } from "./context/SearchContextProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <WalletContextProvider>
        <AnchorContextProvider>
          <ArweaveContextProvider>
            <SearchContextProvider>
              <RouterProvider router={routes} />
            </SearchContextProvider>
          </ArweaveContextProvider>
        </AnchorContextProvider>
      </WalletContextProvider>
    </ChakraProvider>
  </React.StrictMode>
);
