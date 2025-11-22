import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { comprasService, proveedoresService, proveedorItemsService } from '../../api/services';
import { toast } from 'react-toastify';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import { FaPlus, FaTrash } from 'react-icons/fa';

const CompraForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    idProveedor: '',
    fechaCompra: null, // Se asignará automáticamente en el backend
    valorBruto: 0,
    descuento: 0,
    impuesto: 0,
    valorNeto: 0,
    estadoDocumento: 'BORRADOR',
    observaciones: '',
    detalles: [],
  });

  useEffect(() => {
    loadData();
    if (isEdit) {
      loadCompra();
    }
  }, [id]);

  const loadData = async () => {
    try {
      const [proveedoresData, itemsData] = await Promise.all([
        proveedoresService.getAll(),
        proveedorItemsService.getAll(),
      ]);
      setProveedores(proveedoresData);
      setItems(itemsData);
    } catch (error) {
      toast.error('Error al cargar datos');
    }
  };

  const loadCompra = async () => {
    try {
      const data = await comprasService.getById(id);
      setFormData({
        ...data,
        fechaCompra: data.fechaCompra,
      });
    } catch (error) {
      toast.error('Error al cargar la compra');
      navigate('/compras');
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const addDetalle = () => {
    setFormData((prev) => ({
      ...prev,
      detalles: [
        ...prev.detalles,
        { idProveedorItem: '', cantidad: 1, costoUnitario: 0 },
      ],
    }));
  };

  const removeDetalle = (index) => {
    setFormData((prev) => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index),
    }));
  };

  const updateDetalle = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      detalles: prev.detalles.map((det, i) =>
        i === index ? { ...det, [field]: value } : det
      ),
    }));
  };

  const calcularTotales = () => {
    const bruto = formData.detalles.reduce(
      (sum, det) => sum + det.cantidad * det.costoUnitario,
      0
    );
    const descuento = formData.descuento || 0;
    const impuesto = formData.impuesto || 0;
    const neto = bruto - descuento + impuesto;

    setFormData((prev) => ({
      ...prev,
      valorBruto: bruto,
      valorNeto: neto,
    }));
  };

  useEffect(() => {
    calcularTotales();
  }, [formData.detalles, formData.descuento, formData.impuesto]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.detalles.length === 0) {
      toast.error('Debe agregar al menos un detalle');
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        idProveedor: Number(formData.idProveedor),
        detalles: formData.detalles.map((det) => ({
          idProveedorItem: Number(det.idProveedorItem),
          cantidad: Number(det.cantidad),
          costoUnitario: Number(det.costoUnitario),
        })),
      };

      // Si no hay fecha (modo creación), eliminarla del objeto para que el backend asigne la actual
      if (!dataToSend.fechaCompra) {
        delete dataToSend.fechaCompra;
      }

      if (isEdit) {
        await comprasService.update(id, dataToSend);
        toast.success('Compra actualizada exitosamente');
      } else {
        await comprasService.create(dataToSend);
        toast.success('Compra creada exitosamente');
      }
      navigate('/compras');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar la compra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Card
        title={isEdit ? 'Editar Compra' : 'Nueva Compra'}
        subtitle={isEdit ? 'Actualizar orden de compra' : 'Crear nueva orden de compra'}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="input-label">Proveedor *</label>
              <select
                name="idProveedor"
                value={formData.idProveedor}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Seleccione un proveedor</option>
                {proveedores.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.razonSocial}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Descuento"
              type="number"
              step="0.01"
              name="descuento"
              value={formData.descuento}
              onChange={handleChange}
            />

            <Input
              label="Impuesto"
              type="number"
              step="0.01"
              name="impuesto"
              value={formData.impuesto}
              onChange={handleChange}
            />

            <div>
              <label className="input-label">Estado *</label>
              <select
                name="estadoDocumento"
                value={formData.estadoDocumento}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="BORRADOR">BORRADOR</option>
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="APROBADA">APROBADA</option>
                <option value="RECHAZADA">RECHAZADA</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label className="input-label">Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              className="input"
              rows="3"
            />
          </div>

          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Detalles de la Compra</h3>
              <Button type="button" size="small" icon={<FaPlus />} onClick={addDetalle}>
                Agregar Item
              </Button>
            </div>

            {formData.detalles.map((detalle, index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr auto',
                  gap: '1rem',
                  marginBottom: '1rem',
                  alignItems: 'end',
                }}
              >
                <div>
                  <label className="input-label">Item *</label>
                  <select
                    value={detalle.idProveedorItem}
                    onChange={(e) => updateDetalle(index, 'idProveedorItem', e.target.value)}
                    required
                    className="input"
                  >
                    <option value="">Seleccione un item</option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nombreElemento} - ${item.precioVenta}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Cantidad"
                  type="number"
                  min="1"
                  value={detalle.cantidad}
                  onChange={(e) => updateDetalle(index, 'cantidad', parseInt(e.target.value))}
                  required
                />

                <Input
                  label="Costo Unitario"
                  type="number"
                  step="0.01"
                  value={detalle.costoUnitario}
                  onChange={(e) => updateDetalle(index, 'costoUnitario', parseFloat(e.target.value))}
                  required
                />

                <Button
                  type="button"
                  variant="danger"
                  size="small"
                  onClick={() => removeDetalle(index)}
                  icon={<FaTrash />}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--light-bg)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>Valor Bruto:</strong>
              <span>${formData.valorBruto.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>Descuento:</strong>
              <span>${formData.descuento.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>Impuesto:</strong>
              <span>${formData.impuesto.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', borderTop: '2px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
              <strong>Valor Neto:</strong>
              <span style={{ color: 'var(--primary-color)' }}>${formData.valorNeto.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Button type="submit" loading={loading}>
              {isEdit ? 'Actualizar' : 'Crear'} Compra
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/compras')}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CompraForm;
