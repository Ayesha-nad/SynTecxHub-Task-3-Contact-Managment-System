import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Import CSS Design System
import './styles/index.css';
import './styles/paper-theme.css';
import './styles/components.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
