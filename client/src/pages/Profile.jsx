import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="mx-auto card card-body" style={{ maxWidth: 480 }}>
      <h3 className="mb-3">My Profile</h3>
      <div className="mb-3"><span className="form-label d-block">Full name</span><strong>{user?.name || 'Not provided'}</strong></div>
      <div className="mb-3"><span className="form-label d-block">Email</span><strong>{user?.email || 'Not provided'}</strong></div>
      <div className="mb-3"><span className="form-label d-block">Account type</span><strong>{user?.role || 'User'}</strong></div>
      <p className="form-text mb-0">Profile editing is not available through the current backend API.</p>
    </div>
  );
}
