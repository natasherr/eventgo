import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// ── Live server health check ───────────────────────────────────────────────────
// Pings GET /api/health every 30 s. States: 'checking' | 'online' | 'offline'
function useServerStatus() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL || '/api';

    async function ping() {
      try {
        const res = await fetch(`${baseUrl}/health`, { method: 'GET' });
        setStatus(res.ok ? 'online' : 'offline');
      } catch {
        setStatus('offline');
      }
    }

    ping(); // immediate first check
    const interval = setInterval(ping, 30_000); // re-check every 30 s
    return () => clearInterval(interval);
  }, []);

  return status;
}

// Icons use inline SVG so there's no FA dependency in the admin app.
const ICONS = {
  dashboard: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  events: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  tickets: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 9a2 2 0 0 1 0-4V4h20v1a2 2 0 0 1 0 4v1a2 2 0 0 1 0 4v1H2v-1a2 2 0 0 1 0-4V9Z" />
      <path strokeDasharray="2 2" d="M9 4v16" />
    </svg>
  ),
  reports: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  security: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  users: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

const MENU = [
  { to: '/admin',          label: 'Dashboard',       icon: ICONS.dashboard, end: true },
  { to: '/admin/events',   label: 'Events',          icon: ICONS.events },
  { to: '/admin/tickets',  label: 'Tickets & Sales', icon: ICONS.tickets },
  { to: '/admin/reports',  label: 'Reports',         icon: ICONS.reports },
  { to: '/admin/users',    label: 'Users',           icon: ICONS.users },
  { to: '/admin/security', label: 'Security',        icon: ICONS.security },
];

// Time-of-day helpers
function getSalutation() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

function getTodayLabel() {
  return new Date().toLocaleDateString('en-KE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).toUpperCase();
}

function getTimeOfDay() {
  const h = new Date().getHours();
  return h < 17 ? 'day' : 'night';
}

const SUN_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MOON_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

// Status dot colours
const STATUS_COLOR = { checking: '#94a3b8', online: '#22c55e', offline: '#ef4444' };
const STATUS_LABEL = { checking: 'Checking…', online: 'Online', offline: 'Offline' };

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const serverStatus = useServerStatus();

  function handleLogout() {
    logout();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        {/* Brand */}
        <Link to="/admin" className="brand" aria-label="Go to dashboard">
          <span className="brand__logo">
            <img src="/logo-icon.png" alt="EventGo logo" />
          </span>
          <div>
            <strong>EventGo</strong>
            <small>ADMINISTRATION</small>
          </div>
        </Link>

        {/* Nav */}
        <nav>
          <p className="nav-label">MAIN MENU</p>
          {MENU.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `nav-item${isActive ? ' nav-item--active' : ''}`
              }
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="sidebar__user">
          <span className="avatar">{(user?.name || 'A')[0].toUpperCase()}</span>
          <div>
            <strong>{user?.name}</strong>
            <small>Administrator</small>
          </div>
          <button className="link-btn" onClick={handleLogout}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <span className="topbar-greeting">
            <span className="topbar-greeting__eyebrow">
              {getTimeOfDay() === 'day' ? SUN_ICON : MOON_ICON}
              {getTodayLabel()}
            </span>
            <span className="topbar-greeting__hello">
              {getSalutation()},{' '}
              <span className="topbar-greeting__name">{user?.name || 'Admin'}</span>
            </span>
            <span className="topbar-greeting__sub">
              Welcome back to the EventGo Admin Panel
            </span>
          </span>
          <span className={`status${serverStatus === 'offline' ? ' status--offline' : ''}`}>
            <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
              <circle cx="4" cy="4" r="4" fill={STATUS_COLOR[serverStatus]} />
            </svg>
            System Status: {STATUS_LABEL[serverStatus]}
          </span>
        </header>

        <main className="content">
          <Outlet />
        </main>

        <footer className="footer">
          &copy; {new Date().getFullYear()} EventGo Admin &middot; Event Ticketing &amp; Reservation System
        </footer>
      </div>
    </div>
  );
}
