import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import "./global.module.css";

import App from "./App.jsx";
import LoginPage from "./components/startPage/LoginPage.jsx";
import NotFound from "./components/startPage/NotFound.jsx";
import CheckAuth from "./components/startPage/CheckAuth.jsx";
import RegistrationPage from "./components/startPage/RegistrationPage.jsx";

import "./i18n";

import { store } from "./slices/store.js";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <CheckAuth>
                <App />
              </CheckAuth>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegistrationPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
