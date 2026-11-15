// client/src/admin/AdminRoutes.jsx
//
// Wires everything together: login, protected layout, dashboard, events, shells.
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './LoginPage';
import EventsPage from './EventsPage';
import TicketsSalesPage from './TicketsSalesPage';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import ReportsPage from './ReportsPage';
import SecurityPage from './SecurityPage';
import UsersPage from './UsersPage';

// Wrapper so UsersPage can receive the current admin's role
function UsersPageWrapper() {
  const { user } = useAuth();
  return <UsersPage currentAdminRole={user?.role} />;
}

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
              <Route path="users" element={<UsersPageWrapper />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
