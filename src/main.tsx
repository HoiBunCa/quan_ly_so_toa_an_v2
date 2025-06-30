import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerAllModules } from 'handsontable/registry'; // Import registerAllModules
import 'handsontable/dist/handsontable.full.min.css'; // Ensure Handsontable CSS is imported

// Removed: Explicitly import and register TextareaEditor and TextareaRenderer
// Removed: import { TextareaEditor } from 'handsontable/editors';
// Removed: import { TextareaRenderer } from 'handsontable/renderers';
// Removed: import Handsontable from 'handsontable'; // Import Handsontable for direct registration

registerAllModules(); // Register all Handsontable modules globally

// Removed: Register specific editor and renderer explicitly
// Removed: Handsontable.editors.registerEditor('textarea', TextareaEditor);
// Removed: Handsontable.renderers.registerRenderer('textarea', TextareaRenderer);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);