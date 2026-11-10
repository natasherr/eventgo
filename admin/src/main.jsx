// client/src/main.jsx  (REPLACES the existing file)
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './admin/admin.css';
import AdminRoutes from './admin/AdminRoutes';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminRoutes />
  </StrictMode>
);
