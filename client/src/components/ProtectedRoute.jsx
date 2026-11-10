import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
}