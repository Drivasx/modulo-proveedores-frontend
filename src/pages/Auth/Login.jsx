import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../api/services';
import { toast } from 'react-toastify';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    correo: '',
    clave: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.correo) newErrors.correo = 'El usuario es requerido';
    if (!formData.clave) newErrors.clave = 'La contraseña es requerida';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(formData);
      setAuth({ correo: formData.correo }, response.token);
      toast.success('¡Bienvenido al sistema!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Sistema de Proveedores</h1>
          <p>Iniciar Sesión</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Usuario"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            error={errors.correo}
            placeholder="Ingrese su usuario"
            required
          />
          <Input
            label="Contraseña"
            type="password"
            name="clave"
            value={formData.clave}
            onChange={handleChange}
            error={errors.clave}
            placeholder="Ingrese su contraseña"
            required
          />
          <Button type="submit" loading={loading} fullWidth>
            Iniciar Sesión
          </Button>
        </form>
        <div className="auth-footer">
          <p>
            ¿No tienes cuenta? <Link to="/register">Registrarse</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
