import { FaBars, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/services';
import { toast } from 'react-toastify';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    logout();
    toast.info('Sesión cerrada exitosamente');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <h1 className="navbar-title">Sistema de Proveedores</h1>
      </div>
      <div className="navbar-right">
        <div className="user-info">
          <FaUser />
          <span>{user?.nombre || user?.username || 'Usuario'}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
          <FaSignOutAlt />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
