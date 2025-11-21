import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { proveedoresService, tiposProveedorService } from '../../api/services';
import { toast } from 'react-toastify';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';

const ProveedorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [tiposProveedor, setTiposProveedor] = useState([]);
  const [formData, setFormData] = useState({
    idTipoProveedor: '',
    documento: '',
    razonSocial: '',
    representante: '',
    direccion: '',
    correo: '',
    telefono: '',
    contacto: '',
    saldoActual: 0,
    comprasMes: 0,
    estadoProveedor: 'ACTIVO',
  });

  useEffect(() => {
    loadTiposProveedor();
    if (isEdit) {
      loadProveedor();
    }
  }, [id]);

  const loadTiposProveedor = async () => {
    try {
      const data = await tiposProveedorService.getAll();
      setTiposProveedor(data);
    } catch (error) {
      toast.error('Error al cargar tipos de proveedor');
    }
  };

  const loadProveedor = async () => {
    try {
      const data = await proveedoresService.getById(id);
      setFormData(data);
    } catch (error) {
      toast.error('Error al cargar el proveedor');
      navigate('/proveedores');
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await proveedoresService.update(id, formData);
        toast.success('Proveedor actualizado exitosamente');
      } else {
        await proveedoresService.create(formData);
        toast.success('Proveedor creado exitosamente');
      }
      navigate('/proveedores');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar el proveedor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Card
        title={isEdit ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        subtitle={isEdit ? 'Actualizar información del proveedor' : 'Crear un nuevo proveedor'}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="input-label">
                Tipo de Proveedor <span className="required">*</span>
              </label>
              <select
                name="idTipoProveedor"
                value={formData.idTipoProveedor}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Seleccione un tipo</option>
                {tiposProveedor.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.descripcion}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Documento"
              type="number"
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              required
            />

            <Input
              label="Razón Social"
              name="razonSocial"
              value={formData.razonSocial}
              onChange={handleChange}
              required
            />

            <Input
              label="Representante"
              name="representante"
              value={formData.representante}
              onChange={handleChange}
              required
            />

            <Input
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
            />

            <Input
              label="Correo"
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />

            <Input
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />

            <Input
              label="Contacto"
              name="contacto"
              value={formData.contacto}
              onChange={handleChange}
            />

            <Input
              label="Saldo Actual"
              type="number"
              name="saldoActual"
              value={formData.saldoActual}
              onChange={handleChange}
            />

            <Input
              label="Compras del Mes"
              type="number"
              name="comprasMes"
              value={formData.comprasMes}
              onChange={handleChange}
            />

            <div>
              <label className="input-label">
                Estado <span className="required">*</span>
              </label>
              <select
                name="estadoProveedor"
                value={formData.estadoProveedor}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Button type="submit" loading={loading}>
              {isEdit ? 'Actualizar' : 'Crear'} Proveedor
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/proveedores')}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProveedorForm;
