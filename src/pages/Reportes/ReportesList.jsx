import { useEffect, useState } from 'react';
import { reportesService } from '../../api/services';
import { toast } from 'react-toastify';
import { FaTrash, FaEye } from 'react-icons/fa';
import { format } from 'date-fns';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';

const ReportesList = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState({ isOpen: false, reporte: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, reporte: null });

  useEffect(() => {
    loadReportes();
  }, []);

  const renderValorSimple = (key, value) => {
    if (value === null || value === undefined) {
      return '-';
    }

    // Estados
    if (key === 'estado' || key === 'estadoDocumento' || key === 'estadoProveedor') {
      const estadoColors = {
        'APROBADA': { bg: '#d1fae5', color: '#065f46' },
        'PENDIENTE': { bg: '#fef3c7', color: '#92400e' },
        'RECHAZADA': { bg: '#fee2e2', color: '#991b1b' },
        'ACTIVO': { bg: '#d1fae5', color: '#065f46' },
        'INACTIVO': { bg: '#fee2e2', color: '#991b1b' },
      };
      const colors = estadoColors[value] || { bg: '#e5e7eb', color: '#1f2937' };
      return (
        <span style={{
          padding: '2px 10px',
          borderRadius: '12px',
          fontSize: '0.85rem',
          fontWeight: '600',
          background: colors.bg,
          color: colors.color
        }}>
          {value}
        </span>
      );
    }

    // Números con formato especial
    if (typeof value === 'number') {
      if (key.toLowerCase().includes('precio') || 
          key.toLowerCase().includes('total') || 
          key.toLowerCase().includes('valor') ||
          key.toLowerCase().includes('saldo') ||
          key.toLowerCase().includes('neto')) {
        return `$${value.toLocaleString('es-CO', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
      }
      return value.toLocaleString('es-CO');
    }

    // Fechas
    if ((key.toLowerCase().includes('fecha') || key.toLowerCase().includes('date')) && typeof value === 'string') {
      try {
        const fecha = new Date(value);
        if (!isNaN(fecha.getTime())) {
          return fecha.toLocaleString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      } catch (e) {
        // Si falla el parseo, devolver el valor original
      }
    }

    return String(value);
  };

  const renderValorLegible = (key, value, nivel = 0) => {
    if (value === null || value === undefined) {
      return <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Sin información</span>;
    }

    // Arrays
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Vacío</span>;
      }
      
      return (
        <div style={{ marginTop: '0.5rem' }}>
          {value.map((item, i) => (
            <div
              key={i}
              style={{
                padding: '0.75rem',
                marginBottom: '0.5rem',
                background: '#f3f4f6',
                borderRadius: '6px',
                borderLeft: '3px solid #6366f1',
              }}
            >
              <div style={{ fontWeight: '600', color: '#4f46e5', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                Item {i + 1}
              </div>
              {typeof item === 'object' && item !== null ? (
                Object.entries(item)
                  .filter(([k]) => k !== 'idUsuario')
                  .map(([k, v]) => {
                    const fieldName = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
                    return (
                      <div key={k} style={{ fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        <span style={{ color: '#6b7280', fontWeight: '500' }}>{fieldName}:</span>{' '}
                        <span style={{ color: '#1f2937' }}>{renderValorSimple(k, v)}</span>
                      </div>
                    );
                  })
              ) : (
                <span style={{ color: '#1f2937' }}>{String(item)}</span>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Objetos anidados
    if (typeof value === 'object') {
      return (
        <div style={{ marginTop: '0.5rem', marginLeft: nivel > 0 ? '1rem' : '0' }}>
          {Object.entries(value).map(([k, v]) => {
            const fieldName = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
            return (
              <div key={k} style={{ marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: '500', color: '#6b7280' }}>{fieldName}:</span>{' '}
                {typeof v === 'object' && v !== null ? (
                  renderValorLegible(k, v, nivel + 1)
                ) : (
                  <span style={{ color: '#1f2937' }}>{renderValorSimple(k, v)}</span>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    return renderValorSimple(key, value);
  };

  const renderContenidoLegible = (contenido) => {
    if (!contenido || !Array.isArray(contenido)) {
      return <div style={{ color: '#9ca3af', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>Sin datos disponibles</div>;
    }

    if (contenido.length === 0) {
      return <div style={{ color: '#9ca3af', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>No hay registros en este reporte</div>;
    }

    return (
      <div style={{ marginTop: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
        {contenido.map((item, index) => (
          <div
            key={index}
            style={{
              padding: '1rem',
              marginBottom: '0.75rem',
              background: index % 2 === 0 ? '#f9fafb' : '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              borderLeft: '4px solid #3b82f6',
            }}
          >
            <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              Registro #{index + 1}
            </div>
            {Object.entries(item)
              .filter(([key]) => key !== 'idUsuario')
              .map(([key, value]) => {
                const fieldName = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase())
                  .trim();

                return (
                  <div key={key} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <div style={{ fontWeight: '500', color: '#4b5563', marginBottom: '0.2rem' }}>
                      {fieldName}:
                    </div>
                    <div style={{ color: '#1f2937', marginLeft: '0.5rem' }}>
                      {renderValorLegible(key, value)}
                    </div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    );
  };

  const loadReportes = async () => {
    try {
      const data = await reportesService.getAll();
      setReportes(data);
    } catch (error) {
      toast.error('Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await reportesService.delete(deleteModal.reporte.id);
      toast.success('Reporte eliminado exitosamente');
      loadReportes();
      setDeleteModal({ isOpen: false, reporte: null });
    } catch (error) {
      toast.error('Error al eliminar el reporte');
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id', width: '200px' },
    { header: 'Tipo', accessor: 'tipoReporte' },
    { header: 'Descripción', accessor: 'descripcion' },
    {
      header: 'Acciones',
      width: '120px',
      render: (row) => (
        <div className="table-actions">
          <button
            className="action-btn btn-info"
            onClick={() => setViewModal({ isOpen: true, reporte: row })}
            title="Ver contenido"
          >
            <FaEye />
          </button>
          <button
            className="action-btn btn-delete"
            onClick={() => setDeleteModal({ isOpen: true, reporte: row })}
            title="Eliminar"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <Card
        title="Reportes Generados"
        subtitle="Historial de reportes del sistema"
      >
        <Table columns={columns} data={reportes} loading={loading} />
      </Card>

      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, reporte: null })}
        title={`Reporte: ${viewModal.reporte?.tipoReporte}`}
        size="large"
      >
        {viewModal.reporte && (
          <div>
            <div style={{ 
              padding: '1rem', 
              background: '#f3f4f6', 
              borderRadius: '8px', 
              marginBottom: '1.5rem',
              borderLeft: '4px solid #3b82f6'
            }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: '#4b5563' }}>ID:</strong> 
                <span style={{ marginLeft: '0.5rem', color: '#1f2937' }}>{viewModal.reporte.id}</span>
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: '#4b5563' }}>Tipo:</strong> 
                <span style={{ marginLeft: '0.5rem', color: '#1f2937' }}>{viewModal.reporte.tipoReporte}</span>
              </div>
              <div>
                <strong style={{ color: '#4b5563' }}>Descripción:</strong> 
                <span style={{ marginLeft: '0.5rem', color: '#1f2937' }}>{viewModal.reporte.descripcion || '-'}</span>
              </div>
            </div>
            <div>
              <div style={{ 
                fontWeight: '600', 
                fontSize: '1.05rem', 
                color: '#1f2937', 
                marginBottom: '0.5rem',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '0.5rem'
              }}>
                📊 Datos del Reporte
              </div>
              {viewModal.reporte.contenido && Array.isArray(viewModal.reporte.contenido) ? (
                <>
                  <div style={{ 
                    marginBottom: '1rem', 
                    color: '#059669', 
                    fontWeight: '600',
                    fontSize: '0.95rem'
                  }}>
                    ✅ {viewModal.reporte.contenido.length} registro(s) encontrado(s)
                  </div>
                  {renderContenidoLegible(viewModal.reporte.contenido)}
                </>
              ) : (
                <div style={{ 
                  padding: '2rem', 
                  textAlign: 'center', 
                  background: '#fff3cd',
                  border: '1px solid #ffc107',
                  borderRadius: '8px',
                  color: '#856404'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📭</div>
                  <div style={{ fontWeight: '600' }}>Sin datos disponibles</div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, reporte: null })}
        title="Confirmar Eliminación"
        size="small"
      >
        <p>¿Estás seguro de eliminar este reporte?</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <Button variant="danger" onClick={handleDelete} fullWidth>
            Eliminar
          </Button>
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ isOpen: false, reporte: null })}
            fullWidth
          >
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ReportesList;
