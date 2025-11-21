import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTruck, FaShoppingCart, FaFileAlt, FaBoxes } from 'react-icons/fa';
import { proveedoresService, comprasService, reportesService, proveedorItemsService } from '../../api/services';
import Card from '../../components/Common/Card';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    proveedores: 0,
    compras: 0,
    reportes: 0,
    items: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [proveedores, compras, reportes, items] = await Promise.all([
        proveedoresService.getAll(),
        comprasService.getAll(),
        reportesService.getAll(),
        proveedorItemsService.getAll(),
      ]);

      setStats({
        proveedores: proveedores.length,
        compras: compras.length,
        reportes: reportes.length,
        items: items.length,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Proveedores',
      value: stats.proveedores,
      icon: <FaTruck />,
      color: '#3b82f6',
      link: '/proveedores',
    },
    {
      title: 'Órdenes de Compra',
      value: stats.compras,
      icon: <FaShoppingCart />,
      color: '#10b981',
      link: '/compras',
    },
    {
      title: 'Items',
      value: stats.items,
      icon: <FaBoxes />,
      color: '#f59e0b',
      link: '/proveedor-items',
    },
    {
      title: 'Reportes',
      value: stats.reportes,
      icon: <FaFileAlt />,
      color: '#8b5cf6',
      link: '/reportes',
    },
  ];

  if (loading) {
    return (
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="loading-message">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Bienvenido al sistema de gestión de proveedores</p>
      </div>

      <div className="stats-grid">
        {statsCards.map((stat, index) => (
          <Link to={stat.link} key={index} className="stat-card-link">
            <Card className="stat-card">
              <div className="stat-icon" style={{ background: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-title">{stat.title}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="dashboard-grid">
        <Card title="Accesos Rápidos">
          <div className="quick-actions">
            <Link to="/compras/nueva" className="quick-action-btn">
              <FaShoppingCart />
              <span>Nueva Compra</span>
            </Link>
            <Link to="/proveedores/nuevo" className="quick-action-btn">
              <FaTruck />
              <span>Nuevo Proveedor</span>
            </Link>
            <Link to="/reportes/generar" className="quick-action-btn">
              <FaFileAlt />
              <span>Generar Reporte</span>
            </Link>
          </div>
        </Card>

        <Card title="Información del Sistema">
          <div className="system-info">
            <div className="info-item">
              <strong>Versión:</strong>
              <span>1.0.0</span>
            </div>
            <div className="info-item">
              <strong>Backend:</strong>
              <span>API Gateway :8080</span>
            </div>
            <div className="info-item">
              <strong>Servicios:</strong>
              <span>4 Microservicios</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
