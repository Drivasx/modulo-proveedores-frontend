import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, token } = useAuthStore();
  
  const hasToken = token || localStorage.getItem('token');
  
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
