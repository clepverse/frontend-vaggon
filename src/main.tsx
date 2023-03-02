import React from 'react';
import ReactDOM from 'react-dom/client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';

import { BrowserRouter } from 'react-router-dom';

import Router from './Router';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ChakraProvider theme={theme}>
          <Router />
          <ToastContainer />
        </ChakraProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
