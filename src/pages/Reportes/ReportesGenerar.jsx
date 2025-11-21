import { useState } from 'react';
import { reportesService, proveedoresService, comprasService } from '../../api/services';
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
  const [estadosDisponibles, setEstadosDisponibles] = useState([]);
  const [filtros, setFiltros] = useState({
    estado: 'PENDIENTE',
    idProveedor: '',
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
  });

  useEffect(() => {
    loadProveedores();
    loadEstadosDisponibles();
  }, []);

  const loadProveedores = async () => {
    try {
      const data = await proveedoresService.getAll();
      setProveedores(data);
    } catch (error) {
      console.error('Error loading proveedores');
    }
  };

  const loadEstadosDisponibles = async () => {
    try {
      const compras = await comprasService.getAll();
      const estados = [...new Set(compras.map(c => c.estado).filter(Boolean))];
      setEstadosDisponibles(estados);
      console.log('📊 Estados disponibles en compras:', estados);
    } catch (error) {
      console.error('Error loading estados', error);
    }
  };

  const generarReporte = async (tipo) => {
    setLoading(true);
    setReporteGenerado(null);

    console.log('🔍 Generando reporte:', tipo);
    console.log('📊 Filtros actuales:', filtros);

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
          reporte = await reportesService.ordenesPorProveedor(parseInt(filtros.idProveedor));
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

      console.log('✅ Reporte generado:', reporte);
      console.log('📦 Contenido del reporte:', reporte?.contenido);
      console.log('📝 Tipo de contenido:', typeof reporte?.contenido);
      console.log('📏 Longitud (si es array):', Array.isArray(reporte?.contenido) ? reporte.contenido.length : 'no es array');

      setReporteGenerado(reporte);
      toast.success('Reporte generado exitosamente');
    } catch (error) {
      console.error('❌ Error al generar reporte:', error);
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
                {estadosDisponibles.length > 0 ? (
                  estadosDisponibles.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))
                ) : (
                  <>
                    <option value="BORRADOR">BORRADOR</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="APROBADA">APROBADA</option>
                    <option value="RECHAZADA">RECHAZADA</option>
                  </>
                )}
              </select>
              {estadosDisponibles.length > 0 && (
                <small style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  {estadosDisponibles.length} estado(s) con compras registradas
                </small>
              )}
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
              <strong>ID:</strong> {reporteGenerado.id}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Tipo:</strong> {reporteGenerado.tipoReporte}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Descripción:</strong> {reporteGenerado.descripcion || '-'}
            </div>
            <div>
              <strong>Contenido:</strong>
              {reporteGenerado.contenido && Array.isArray(reporteGenerado.contenido) && reporteGenerado.contenido.length > 0 ? (
                <>
                  <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem', color: 'var(--success)', fontWeight: '600' }}>
                    ✅ {reporteGenerado.contenido.length} registro(s) encontrado(s)
                  </div>
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
                    {JSON.stringify(reporteGenerado.contenido, null, 2)}
                  </pre>
                </>
              ) : (
                <div style={{
                  marginTop: '1rem',
                  padding: '2rem',
                  background: '#fff3cd',
                  border: '1px solid #ffc107',
                  borderRadius: '6px',
                  textAlign: 'center',
                  color: '#856404'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📭</div>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>No se encontraron registros</div>
                  <div style={{ fontSize: '0.9rem' }}>
                    {reporteGenerado.tipoReporte === 'ordenes-por-estado' && 
                      `No hay órdenes con estado "${filtros.estado}"`}
                    {reporteGenerado.tipoReporte === 'ordenes-por-proveedor' && 
                      `No hay órdenes para el proveedor seleccionado`}
                    {reporteGenerado.tipoReporte === 'ordenes-por-mes' && 
                      `No hay órdenes en ${filtros.mes}/${filtros.anio}`}
                    {!['ordenes-por-estado', 'ordenes-por-proveedor', 'ordenes-por-mes'].includes(reporteGenerado.tipoReporte) &&
                      'Los datos para este reporte no están disponibles'}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </Card>
    </div>
  );
};

export default ReportesGenerar;
