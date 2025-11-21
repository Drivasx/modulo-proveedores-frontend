import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { comprasService, proveedoresService } from '../../api/services';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';

const CompraDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [compra, setCompra] = useState(null);
  const [proveedor, setProveedor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompra();
  }, [id]);

  const loadCompra = async () => {
    try {
      const compraData = await comprasService.getById(id);
      setCompra(compraData);

      const proveedorData = await proveedoresService.getById(compraData.idProveedor);
      setProveedor(proveedorData);
    } catch (error) {
      toast.error('Error al cargar la compra');
      navigate('/compras');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page-container">Cargando...</div>;
  }

  if (!compra) {
    return null;
  }

  return (
    <div className="page-container">
      <Card
        title={`Orden de Compra #${compra.id}`}
        subtitle={`Fecha: ${format(new Date(compra.fechaCompra), 'dd/MM/yyyy')}`}
        actions={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button onClick={() => navigate(`/compras/${id}/editar`)}>
              Editar
            </Button>
            <Button variant="secondary" onClick={() => navigate('/compras')}>
              Volver
            </Button>
          </div>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Información del Proveedor</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div><strong>Razón Social:</strong> {proveedor?.razonSocial}</div>
              <div><strong>Documento:</strong> {proveedor?.documento}</div>
              <div><strong>Correo:</strong> {proveedor?.correo}</div>
              <div><strong>Teléfono:</strong> {proveedor?.telefono}</div>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem' }}>Información de la Compra</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div><strong>Estado:</strong> <span className={`badge badge-${compra.estadoDocumento.toLowerCase()}`}>{compra.estadoDocumento}</span></div>
              <div><strong>Valor Bruto:</strong> ${compra.valorBruto.toLocaleString()}</div>
              <div><strong>Descuento:</strong> ${compra.descuento.toLocaleString()}</div>
              <div><strong>Impuesto:</strong> ${compra.impuesto.toLocaleString()}</div>
              <div><strong>Valor Neto:</strong> <span style={{ color: 'var(--primary-color)', fontSize: '1.25rem', fontWeight: 'bold' }}>${compra.valorNeto.toLocaleString()}</span></div>
            </div>
          </div>
        </div>

        {compra.observaciones && (
          <div style={{ marginTop: '2rem' }}>
            <h3>Observaciones</h3>
            <p style={{ marginTop: '0.5rem', padding: '1rem', background: 'var(--light-bg)', borderRadius: '6px' }}>
              {compra.observaciones}
            </p>
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Detalles de la Compra</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Cantidad</th>
                <th>Costo Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {compra.detalles?.map((detalle, index) => (
                <tr key={index}>
                  <td>Item #{detalle.idProveedorItem}</td>
                  <td>{detalle.cantidad}</td>
                  <td>${detalle.costoUnitario.toLocaleString()}</td>
                  <td>${(detalle.cantidad * detalle.costoUnitario).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default CompraDetail;
