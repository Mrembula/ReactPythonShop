import { StrictMode } from 'react'
import "bootstrap/dist/css/bootstrap.css";
import { createRoot } from 'react-dom/client';
import App from './App.jsx'
// Css styling is class capitalized because I also use bootstrap for styling so no clashing

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
);