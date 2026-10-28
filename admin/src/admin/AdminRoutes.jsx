// client/src/admin/AdminRoutes.jsx
//
// Wires everything together: login, protected layout, dashboard, events, shells.
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './LoginPage';
import EventsPage from './EventsPage';

import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import ComingSoon from './ComingSoon';

export default function AdminRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Everything inside here needs a valid admin session */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="tickets" element={<ComingSoon title="Tickets & Sales" />} />
              <Route path="reports" element={<ComingSoon title="Reports" note="PDF report generation arrives with the next backend update." />} />
              <Route path="security" element={<ComingSoon title="Security" note="Two-factor authentication setup arrives with the next backend update." />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
