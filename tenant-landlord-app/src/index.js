import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/App.js';
import reportWebVitals from './reportWebVitals.js';
import { BrowserRouter } from 'react-router-dom';
import {AuthProvider} from "react-auth-kit";
import { ChakraProvider } from '@chakra-ui/react';

// const textEmail = document.getElementById('textEmail');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider>
  <AuthProvider
    authType={"cookie"}
    authName={"_auth"}
    cookieDomain={window.location.hostname}
    cookieSecure={false}
    >
      <ChakraProvider>
        <BrowserRouter>
          <>
            
              <App />
          </>
        </BrowserRouter>
      </ChakraProvider>
  

  </AuthProvider>
  </ChakraProvider>

);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
