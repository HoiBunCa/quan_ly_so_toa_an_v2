# AI Development Rules for CourtFlow - Case Management System

This document outlines the core technologies and libraries used in this application, along with guidelines for their usage. Adhering to these rules ensures consistency, maintainability, and optimal performance.

## Tech Stack Overview

*   **React:** The primary JavaScript library for building the user interface.
*   **TypeScript:** The programming language used for all application code, providing type safety and improved developer experience.
*   **Tailwind CSS:** A utility-first CSS framework used for all styling, enabling rapid and consistent UI development.
*   **Handsontable:** A powerful data grid component for building interactive spreadsheet-like tables, used for case management.
*   **Lucide React:** A collection of beautiful and customizable open-source icons, integrated for visual elements.
*   **Vite:** The build tool used for fast development and optimized production builds.
*   **ESLint:** Configured for code linting to maintain code quality and consistency.
*   **Local React State:** Component-level state management using React's `useState` and `useRef` hooks.

## Library Usage Guidelines

*   **UI Components:**
    *   For new UI components, **always prioritize using components from the `shadcn/ui` library**. These components are pre-styled with Tailwind CSS and provide accessibility features.
    *   For existing custom components, maintain their current styling and structure. Refactor to `shadcn/ui` only if specifically requested or if a significant overhaul is planned.
*   **Styling:**
    *   **Exclusively use Tailwind CSS** for all styling. Avoid writing custom CSS in separate files or using inline styles unless absolutely necessary for specific third-party library overrides (e.g., Handsontable's base styles).
    *   Leverage Tailwind's utility classes for layout, spacing, colors, typography, and responsiveness.
*   **Icons:**
    *   All icons should be imported and used from the `lucide-react` library.
*   **Data Grids/Tables:**
    *   For interactive, spreadsheet-like data tables, use the `@handsontable/react` component.
*   **Routing:**
    *   The application currently manages page navigation using React component state. If more complex routing or URL-based navigation is required, `react-router-dom` is the preferred library to integrate.
*   **State Management:**
    *   For component-specific or localized state, use React's built-in `useState` and `useReducer` hooks.
    *   For sharing state between components without prop drilling, `React.createContext` (Context API) should be used.
    *   Avoid introducing external state management libraries (e.g., Redux, Zustand) unless a clear and significant need for global, complex state management arises.
*   **Forms:**
    *   Use standard React controlled components for form handling.
*   **Utility Functions:**
    *   Create small, focused utility functions and place them in the `src/utils/` directory.