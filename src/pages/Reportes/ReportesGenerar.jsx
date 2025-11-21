import { useState } from 'react';
import { reportesService, proveedoresService } from '../../api/services';
import { toast } from 'react-toastify';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import { FaChartBar, FaFileAlt } from 'react-icons/fa';
import { useEffect } from 'react';

const ReportesGenerar = () => {
  const [loading, setLoading] = useState(false);
  const [reporteGenerado, setReporteGenerado] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [filtros, setFiltros] = useState({
    estado: 'PENDIENTE',
    idProveedor: '',
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
  });

  useEffect(() => {
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    try {
      const data = await proveedoresService.getAll();
      setProveedores(data);
    } catch (error) {
      console.error('Error loading proveedores');
    }
  };

  const generarReporte = async (tipo) => {
    setLoading(true);
    setReporteGenerado(null);

    try {
      let reporte;
      switch (tipo) {
        case 'proveedores-mas-usados':
          reporte = await reportesService.proveedoresMasUsados();
          break;
        case 'items-mas-comprados':
          reporte = await reportesService.itemsMasComprados();
          break;
        case 'ordenes-por-estado':
          reporte = await reportesService.ordenesPorEstado(filtros.estado);
          break;
        case 'ordenes-por-proveedor':
          if (!filtros.idProveedor) {
            toast.error('Seleccione un proveedor');
            setLoading(false);
            return;
          }
          reporte = await reportesService.ordenesPorProveedor(filtros.idProveedor);
          break;
        case 'ordenes-por-mes':
          reporte = await reportesService.ordenesPorMes(filtros.mes, filtros.anio);
          break;
        case 'proveedores-con-items':
          reporte = await reportesService.proveedoresConItems();
          break;
        default:
          toast.error('Tipo de reporte no válido');
          setLoading(false);
          return;
      }

      setReporteGenerado(reporte);
      toast.success('Reporte generado exitosamente');
    } catch (error) {
      toast.error('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const reportButtons = [
    { label: 'Proveedores Más Usados', tipo: 'proveedores-mas-usados', color: '#3b82f6' },
    { label: 'Items Más Comprados', tipo: 'items-mas-comprados', color: '#10b981' },
    { label: 'Órdenes por Estado', tipo: 'ordenes-por-estado', color: '#f59e0b', requiresFilter: 'estado' },
    { label: 'Órdenes por Proveedor', tipo: 'ordenes-por-proveedor', color: '#8b5cf6', requiresFilter: 'proveedor' },
    { label: 'Órdenes por Mes', tipo: 'ordenes-por-mes', color: '#ef4444', requiresFilter: 'mes' },
    { label: 'Proveedores con Items', tipo: 'proveedores-con-items', color: '#06b6d4' },
  ];

  return (
    <div className="page-container">
      <Card
        title="Generar Reportes"
        subtitle="Seleccione el tipo de reporte que desea generar"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {reportButtons.map((btn) => (
            <button
              key={btn.tipo}
              onClick={() => generarReporte(btn.tipo)}
              disabled={loading}
              style={{
                padding: '1.5rem',
                background: btn.color,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <FaChartBar />
              {btn.label}
            </button>
          ))}
        </div>

        <Card title="Filtros" className="mt-3">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="input-label">Estado</label>
              <select
                value={filtros.estado}
                onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                className="input"
              >
                <option value="BORRADOR">BORRADOR</option>
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="APROBADA">APROBADA</option>
                <option value="RECHAZADA">RECHAZADA</option>
              </select>
            </div>

            <div>
              <label className="input-label">Proveedor</label>
              <select
                value={filtros.idProveedor}
                onChange={(e) => setFiltros({ ...filtros, idProveedor: e.target.value })}
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
              label="Mes"
              type="number"
              min="1"
              max="12"
              value={filtros.mes}
              onChange={(e) => setFiltros({ ...filtros, mes: parseInt(e.target.value) })}
            />

            <Input
              label="Año"
              type="number"
              min="2020"
              max="2030"
              value={filtros.anio}
              onChange={(e) => setFiltros({ ...filtros, anio: parseInt(e.target.value) })}
            />
          </div>
        </Card>

        {reporteGenerado && (
          <Card title="Resultado del Reporte" className="mt-3">
            <div style={{ marginBottom: '1rem' }}>
              <strong>Tipo:</strong> {reporteGenerado.tipoReporte}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Generado Por:</strong> {reporteGenerado.generadoPor}
            </div>
            <div>
              <strong>Contenido:</strong>
              <pre
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: 'var(--light-bg)',
                  borderRadius: '6px',
                  overflow: 'auto',
                  maxHeight: '400px',
                }}
              >
                {JSON.stringify(reporteGenerado.contenidoReporte, null, 2)}
              </pre>
            </div>
          </Card>
        )}
      </Card>
    </div>
  );
};

export default ReportesGenerar;
