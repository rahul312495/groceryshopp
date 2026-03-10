import React from 'react';
import ReactDOM from 'react-dom/client';
import { <BrowserRouter basename="/"> } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App.jsx';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter basename="/">
  </React.StrictMode>
);
