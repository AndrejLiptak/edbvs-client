import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createClient, Provider, fetchExchange, cacheExchange } from "urql";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { Auth0ProviderWithNavigate } from "./auth0-provider-with-navigate";
import { ProfilePage } from "./components/profile/Profile";
import { AuthenticationGuard } from "./authenticationGuard";
import { Admin } from "./components/admin/Admin";
import "./styles/main.css";
import { DeviceNode } from "./components/designer/diagram/nodes/DeviceNode";
import Designer from "./components/designer/Designer";
import { ThemeProvider, createTheme } from "@mui/material";



const client = createClient({
  url: import.meta.env.VITE_API_URL || "http://localhost:4000/graphql"
});

const customNodeType = "customNode";

export const nodeTypes = {
  [customNodeType]: DeviceNode,
};

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: "#00897b",
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#0288d1',
    },
  },
  typography: {
    fontFamily: 
    'sans-serif',

  
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider value={client}>
      <BrowserRouter>
        <Auth0ProviderWithNavigate>
          <ThemeProvider theme={theme}>


         
          <Routes>
          <Route path="/" element={<Designer />}></Route>
            
            <Route
              path="/profile"
              element={<AuthenticationGuard component={ProfilePage} />}
            ></Route>
            <Route
              path="/admin"
              element={<AuthenticationGuard component={Admin} />}
            ></Route>
          </Routes>
          </ThemeProvider>
        </Auth0ProviderWithNavigate>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
