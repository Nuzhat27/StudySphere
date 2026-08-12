import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap route elements: <ProtectedRoute roles={['educator','admin']}><Page/></ProtectedRoute>
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return children;
}
