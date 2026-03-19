
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { CityProvider } from "./contexts/CityContext";
import { Toaster } from "react-hot-toast";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element '#root' was not found in index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <CityProvider>
        <App />
        <Toaster position="top-right" />
      </CityProvider>
    </AuthProvider>
  </React.StrictMode>
);
