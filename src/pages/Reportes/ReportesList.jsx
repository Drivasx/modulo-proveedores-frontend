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
            <div style={{ marginBottom: '1rem' }}>
              <strong>ID:</strong> {viewModal.reporte.id}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Tipo:</strong> {viewModal.reporte.tipoReporte}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Descripción:</strong> {viewModal.reporte.descripcion || '-'}
            </div>
            <div>
              <strong>Datos del Reporte:</strong>
              <pre style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'var(--light-bg)',
                borderRadius: '6px',
                overflow: 'auto',
                maxHeight: '400px'
              }}>
                {viewModal.reporte.contenido 
                  ? JSON.stringify(viewModal.reporte.contenido, null, 2)
                  : 'Sin datos disponibles'}
              </pre>
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
