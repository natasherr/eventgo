// client/src/admin/AdminLayout.jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const MENU = [
  { to: '/admin', label: 'Dashboard', icon: '▦', end: true },
  { to: '/admin/events', label: 'Events', icon: '◷' },
  { to: '/admin/tickets', label: 'Tickets & Sales', icon: '▤' },
  { to: '/admin/reports', label: 'Reports', icon: '▥' },
  { to: '/admin/security', label: 'Security', icon: '♧' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand__logo">E</span>
          <div>
            <strong>EventGo</strong>
            <small>ADMINISTRATION</small>
          </div>
        </div>

        <nav>
          <p className="nav-label">MAIN MENU</p>
          {MENU.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}
            >
              <span aria-hidden="true">{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__user">
          <span className="avatar">{(user?.name || 'A')[0].toUpperCase()}</span>
          <div>
            <strong>{user?.name}</strong>
            <small>Administrator</small>
          </div>
          <button className="link-btn" onClick={handleLogout}>Sign out</button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <span className="muted">EventGo / Admin</span>
          <span className="status">● System online</span>
        </header>
        <main className="content">
          <Outlet />
        </main>
        <footer className="footer">© 2026 EventGo Admin · Event Ticketing &amp; Reservation System</footer>
      </div>
    </div>
  );
}
