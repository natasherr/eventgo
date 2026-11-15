import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="eg-404">
      {/* Illustration */}
      <div className="eg-404-art" aria-hidden="true">
        <div className="eg-404-ticket">
          <div className="eg-404-ticket-top">
            <span>EVENTGO</span>
            <span>TICKET</span>
          </div>
          <div className="eg-404-ticket-num">404</div>
          <div className="eg-404-ticket-label">PAGE NOT FOUND</div>
          <div className="eg-404-ticket-barcode">
            {Array.from({ length: 22 }).map((_, i) => (
              <span key={i} className="eg-404-bar" style={{ height: `${18 + (i % 3) * 10}px`, opacity: i % 4 === 0 ? .4 : 1 }} />
            ))}
          </div>
        </div>
        <div className="eg-404-orbit eg-404-orbit-1" />
        <div className="eg-404-orbit eg-404-orbit-2" />
      </div>

      {/* Copy */}
      <div className="eg-404-copy">
        <span className="eg-eyebrow">
          <span className="eg-live-dot" style={{ background: '#ff755e', boxShadow: '0 0 0 5px rgba(255,117,94,.13)' }} />
          ERROR 404
        </span>
        <h1 className="eg-404-heading">Looks like this<br />page took a wrong turn.</h1>
        <p className="eg-404-sub">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to something good.
        </p>
        <div className="eg-404-actions">
          <Link to="/" className="btn btn-eg eg-404-btn-primary">
            <i className="fa-solid fa-house me-2" />Go home
          </Link>
          <Link to="/events" className="btn eg-404-btn-secondary">
            <i className="fa-solid fa-ticket me-2" />Browse events
          </Link>
        </div>
      </div>
    </div>
  );
}
