import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cls = ({ isActive }) => `nav-link${isActive ? ' active fw-semibold' : ''}`;

  return (
    <nav className="navbar navbar-expand-md navbar-dark eg-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand eg-brand" to="/"><span className="eg-brand-icon"><i className="fa-solid fa-ticket" /></span>EventGo</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto eg-nav-links">
            <li className="nav-item"><NavLink end className={cls} to="/">Home</NavLink></li>
            <li className="nav-item"><NavLink className={cls} to="/events">Browse Events</NavLink></li>
            <li className="nav-item"><NavLink className={cls} to="/my-tickets">My Tickets</NavLink></li>
            <li className="nav-item"><NavLink className={cls} to="/help">Help</NavLink></li>
          </ul>
          <ul className="navbar-nav ms-auto align-items-md-center eg-nav-auth">
            {user ? (
              <>
                <li className="nav-item me-md-3"><NavLink className="nav-link eg-nav-user" to="/profile"><i className="fa-regular fa-user" />{user.name}</NavLink></li>
                <li className="nav-item"><button className="eg-nav-logout" onClick={() => { logout(); navigate('/'); }}><i className="fa-solid fa-arrow-right-from-bracket" />Logout</button></li>
              </>
            ) : (
              <>
                <li className="nav-item"><NavLink className={cls} to="/login">Login</NavLink></li>
                <li className="nav-item"><NavLink className={cls} to="/register">Register</NavLink></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
