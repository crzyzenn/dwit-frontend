import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import AuthProvider from "./contexts/AuthContext";
import SnackbarProvider from "./contexts/Snackbar";

// Exercise:
// If user is not loggedin
// links -> login, register
// If logged in:
// links -> Home, products, category, logout

// Implement loading in login.

// After login, fetch user and store it in context...

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
  rootElement
);
