import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ClockProvider } from './context/ClockContext'; // ✅ Make sure this path is correct

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ClockProvider> {/* ✅ Wrap your App with the clock context provider */}
        <App />
      </ClockProvider>
    </BrowserRouter>
  </React.StrictMode>
);
