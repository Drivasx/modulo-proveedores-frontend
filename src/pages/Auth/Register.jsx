import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/services';
import { toast } from 'react-toastify';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    nombre: '',
    correo: '',
    clave: '',
    confirmPassword: '',
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
    if (!formData.username) newErrors.username = 'El usuario es requerido';
    if (!formData.nombre) newErrors.nombre = 'El nombre es requerido';
    if (!formData.correo) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = 'El correo no es válido';
    }
    if (!formData.clave) {
      newErrors.clave = 'La contraseña es requerida';
    } else if (formData.clave.length < 6) {
      newErrors.clave = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (formData.clave !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
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
      const { confirmPassword, ...registerData } = formData;
      await authService.register(registerData);
      toast.success('¡Registro exitoso! Por favor inicia sesión');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Sistema de Proveedores</h1>
          <p>Crear Cuenta</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Usuario"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            placeholder="Ingrese un usuario"
            required
          />
          <Input
            label="Nombre Completo"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            error={errors.nombre}
            placeholder="Ingrese su nombre completo"
            required
          />
          <Input
            label="Correo Electrónico"
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            error={errors.correo}
            placeholder="ejemplo@correo.com"
            required
          />
          <Input
            label="Contraseña"
            type="password"
            name="clave"
            value={formData.clave}
            onChange={handleChange}
            error={errors.clave}
            placeholder="Mínimo 6 caracteres"
            required
          />
          <Input
            label="Confirmar Contraseña"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Repita su contraseña"
            required
          />
          <Button type="submit" loading={loading} fullWidth>
            Registrarse
          </Button>
        </form>
        <div className="auth-footer">
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Iniciar Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
