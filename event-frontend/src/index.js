import "./App.css";
import App from "./App";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";

// src/index.js

// Create a root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render with Suspense
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </I18nextProvider>
  </React.StrictMode>
);