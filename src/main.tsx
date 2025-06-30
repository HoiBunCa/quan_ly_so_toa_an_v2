import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerAllModules } from 'handsontable/registry'; // Import registerAllModules
import 'handsontable/dist/handsontable.full.min.css'; // Ensure Handsontable CSS is imported

// Explicitly import and register TextareaEditor and TextareaRenderer
import { TextareaEditor } from 'handsontable/editors';
import { TextareaRenderer } from 'handsontable/renderers';
import Handsontable from 'handsontable'; // Import Handsontable for direct registration

registerAllModules(); // Register all Handsontable modules globally

// Register specific editor and renderer explicitly
Handsontable.editors.registerEditor('textarea', TextareaEditor);
Handsontable.renderers.registerRenderer('textarea', TextareaRenderer);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);