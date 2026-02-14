import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import './global.module.css'

import App from './App.jsx'
import LoginPage from './components/startPage/LoginPage.jsx'
import NotFound from './components/startPage/NotFound.jsx'
import CheckAuth from './components/startPage/CheckAuth.jsx'
import RegistrationPage from './components/startPage/RegistrationPage.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import filter from 'leo-profanity'
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react'
import { rollbarConfig } from './utils/rollbar.js'

import './i18n'

import { store } from './slices/store.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from './utils/Header.jsx'

const root = document.getElementById('root')

filter.loadDictionary('en')
filter.add(filter.getDictionary('ru'))

ReactDOM.createRoot(root).render(
  <StrictMode>
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <BrowserRouter>
            <ToastContainer />
            <Header />
            <Routes>
              <Route
                path="/"
                element={(
                  <CheckAuth>
                    <App />
                  </CheckAuth>
                )}
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<RegistrationPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  </StrictMode>,
)
