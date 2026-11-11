import { useAuth } from '../context/AuthContext';

const initials = (name) =>
  (name || '')
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="eg-profile">
      <div className="eg-profile-header">
        <span className="eg-profile-avatar">{initials(user?.name)}</span>
        <div>
          <h1 className="eg-profile-title">My Profile</h1>
          <p className="eg-profile-sub">Your account details</p>
        </div>
      </div>

      <dl className="eg-profile-list">
        <div className="eg-profile-row">
          <dt><i className="fa-regular fa-user" />Full name</dt>
          <dd>{user?.name || <span className="eg-profile-empty">Not provided</span>}</dd>
        </div>

        <div className="eg-profile-row">
          <dt><i className="fa-regular fa-envelope" />Email</dt>
          <dd>{user?.email || <span className="eg-profile-empty">Not provided</span>}</dd>
        </div>

        <div className="eg-profile-row">
          <dt><i className="fa-solid fa-shield-halved" />Account type</dt>
          <dd><span className="eg-profile-badge">{user?.role || 'user'}</span></dd>
        </div>
      </dl>

      <p className="eg-profile-note">Profile editing is coming soon.</p>
    </div>
  );
}