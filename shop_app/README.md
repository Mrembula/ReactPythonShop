# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# E-Commerce Platform - Cart & Payment System

## Overview
This project focuses on building a seamless e-commerce experience by implementing dynamic cart functionality, payment system integration, and real-time calculations.

## Features

### 1. **Cart Management**
- Added functionality to allow users to add, remove, and update cart items.
- Implemented logic to sync cart state with backend storage for persistence.
- Optimized API calls to ensure efficient data updates.
- Introduced fallback logic to handle edge cases when modifying cart contents.

### 2. **Grand Total Calculation**
- Dynamically calculated the grand total based on selected items.
- Included tax and discount logic where applicable.
- Ensured consistent synchronization between the backend calculations and frontend display.

### 3. **Mapping Available Store Items**
- Created a dynamic mapping system to render store items efficiently.
- Managed state updates to reflect inventory changes.
- Optimized UI responsiveness for an intuitive user experience.

### 4. **Payment System Integration**
- Implemented Visa, MasterCard, and PayPal payment options.
- Designed state management to activate and disable payment methods dynamically.
- Integrated error handling to address transaction failures.

## Technologies Used
- **Frontend:** React (State management, API integration)
- **Backend:** Django (Serializers for e-commerce logic)
- **Payment Integration:** Visa/MasterCard/PayPal APIs

## Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/Mrembula/ReactPythonShop.git
   
Had to redo my python work as it was lost. Rebuilding the python API