import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerAllModules } from 'handsontable/registry'; // Import registerAllModules
import 'handsontable/dist/handsontable.full.min.css'; // Ensure Handsontable CSS is imported

registerAllModules(); // Register all Handsontable modules globally

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);