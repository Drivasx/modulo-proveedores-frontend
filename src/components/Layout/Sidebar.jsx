import { NavLink } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaTruck, 
  FaShoppingCart, 
  FaFileAlt, 
  FaUsers,
  FaLayerGroup,
  FaBoxes,
  FaChartBar
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/proveedores', label: 'Proveedores', icon: <FaTruck /> },
    { path: '/tipos-proveedor', label: 'Tipos Proveedor', icon: <FaLayerGroup /> },
    { path: '/proveedor-items', label: 'Items', icon: <FaBoxes /> },
    { path: '/compras', label: 'Compras', icon: <FaShoppingCart /> },
    { path: '/reportes', label: 'Reportes', icon: <FaFileAlt /> },
    { path: '/reportes/generar', label: 'Generar Reportes', icon: <FaChartBar /> },
    { path: '/usuarios', label: 'Usuarios', icon: <FaUsers /> },
  ];

  return (
    <aside className={`sidebar ${!isOpen ? 'closed' : ''}`}>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {isOpen && <span className="sidebar-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
