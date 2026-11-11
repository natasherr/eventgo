import { Link } from 'react-router-dom';

const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="eg-footer">
      <div className="container">
        <div className="eg-footer-grid">

          {/* Brand column */}
          <div className="eg-footer-brand-col">
            <Link to="/" className="eg-footer-brand">
              <span className="eg-brand-icon"><i className="fa-solid fa-ticket" /></span>
              EventGo
            </Link>
            <p className="eg-footer-tagline">
              Kenya's home for live events — concerts, culture, sport, and ideas worth showing up for.
            </p>
          </div>

          {/* Discover column — category param pre-fills the BrowseEvents category filter */}
          <div className="eg-footer-col">
            <h4 className="eg-footer-heading">Discover</h4>
            <ul className="eg-footer-links">
              <li><Link to="/events">Browse Events</Link></li>
              <li><Link to="/events?category=Music">Music</Link></li>
              <li><Link to="/events?category=Culture">Culture</Link></li>
              <li><Link to="/events?category=Business">Business</Link></li>
            </ul>
          </div>

          {/* Account column */}
          <div className="eg-footer-col">
            <h4 className="eg-footer-heading">Account</h4>
            <ul className="eg-footer-links">
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/my-tickets">My Tickets</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </ul>
          </div>

          {/* Support column */}
          <div className="eg-footer-col">
            <h4 className="eg-footer-heading">Support</h4>
            <ul className="eg-footer-links">
              <li><Link to="/help">Help Centre</Link></li>
            </ul>
          </div>

          {/* Company column */}
          <div className="eg-footer-col">
            <h4 className="eg-footer-heading">Company</h4>
            <ul className="eg-footer-links">
              <li>
                <a href={`${ADMIN_URL}/admin/login`} className="eg-footer-organizers-link">
                  <i className="fa-solid fa-arrow-up-right-from-square eg-footer-ext-icon" />
                  Organizers
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="eg-footer-bottom">
          <span>&copy; {year} EventGo. All rights reserved.</span>
          <span className="eg-footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
