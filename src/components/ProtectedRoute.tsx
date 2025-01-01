import { Navigate } from 'react-router-dom';
import { User } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: User['role'];
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}