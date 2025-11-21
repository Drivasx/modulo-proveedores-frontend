import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/Auth/PrivateRoute';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import ProveedoresList from './pages/Proveedores/ProveedoresList';
import ProveedorForm from './pages/Proveedores/ProveedorForm';
import TiposProveedorList from './pages/TiposProveedor/TiposProveedorList';
import ProveedorItemsList from './pages/ProveedorItems/ProveedorItemsList';
import ComprasList from './pages/Compras/ComprasList';
import CompraForm from './pages/Compras/CompraForm';
import CompraDetail from './pages/Compras/CompraDetail';
import ReportesList from './pages/Reportes/ReportesList';
import ReportesGenerar from './pages/Reportes/ReportesGenerar';
import UsuariosList from './pages/Usuarios/UsuariosList';
import NotFound from './pages/NotFound';

import './App.css';

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas */}
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Proveedores */}
          <Route path="/proveedores" element={<ProveedoresList />} />
          <Route path="/proveedores/nuevo" element={<ProveedorForm />} />
          <Route path="/proveedores/:id/editar" element={<ProveedorForm />} />
          
          {/* Tipos de Proveedor */}
          <Route path="/tipos-proveedor" element={<TiposProveedorList />} />
          
          {/* Items de Proveedor */}
          <Route path="/proveedor-items" element={<ProveedorItemsList />} />
          
          {/* Compras */}
          <Route path="/compras" element={<ComprasList />} />
          <Route path="/compras/nueva" element={<CompraForm />} />
          <Route path="/compras/:id" element={<CompraDetail />} />
          <Route path="/compras/:id/editar" element={<CompraForm />} />
          
          {/* Reportes */}
          <Route path="/reportes" element={<ReportesList />} />
          <Route path="/reportes/generar" element={<ReportesGenerar />} />
          
          {/* Usuarios (Admin) */}
          <Route path="/usuarios" element={<UsuariosList />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
