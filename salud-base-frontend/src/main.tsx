import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// import './index.css';
import 'junaeb-ds-kit/styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
