// client/src/admin/AdminRoutes.jsx
//
// Wires everything together: login, protected layout, dashboard, events, shells.
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './LoginPage';
import EventsPage from './EventsPage';
import TicketsSalesPage from './TicketsSalesPage';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import ComingSoon from './ComingSoon';
import ReportsPage from './ReportsPage';
import SecurityPage from './SecurityPage';

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
              <Route path="tickets" element={<TicketsSalesPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="security" element={<SecurityPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
