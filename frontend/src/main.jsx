import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/* Import design tokens first, then global styles */
import './styles/tokens.css';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
