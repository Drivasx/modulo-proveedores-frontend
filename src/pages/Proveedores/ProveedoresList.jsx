import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { proveedoresService, tiposProveedorService } from '../../api/services';
import { toast } from 'react-toastify';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';

const ProveedoresList = () => {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [tiposProveedor, setTiposProveedor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, proveedor: null });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [proveedoresData, tiposData] = await Promise.all([
        proveedoresService.getAll(),
        tiposProveedorService.getAll(),
      ]);
      setProveedores(proveedoresData);
      setTiposProveedor(tiposData);
    } catch (error) {
      toast.error('Error al cargar los proveedores');
    } finally {
      setLoading(false);
    }
  };

  const getTipoNombre = (idTipo) => {
    const tipo = tiposProveedor.find((t) => t.id === idTipo);
    return tipo?.descripcion || 'N/A';
  };

  const handleDelete = async () => {
    try {
      await proveedoresService.delete(deleteModal.proveedor.id);
      toast.success('Proveedor eliminado exitosamente');
      loadData();
      setDeleteModal({ isOpen: false, proveedor: null });
    } catch (error) {
      toast.error('Error al eliminar el proveedor');
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id', width: '60px' },
    { header: 'Documento', accessor: 'documento' },
    { header: 'Razón Social', accessor: 'razonSocial' },
    {
      header: 'Tipo',
      render: (row) => getTipoNombre(row.idTipoProveedor),
    },
    { header: 'Correo', accessor: 'correo' },
    { header: 'Teléfono', accessor: 'telefono' },
    {
      header: 'Estado',
      render: (row) => (
        <span
          className={`badge ${
            row.estadoProveedor === 'A' ? 'badge-success' : 'badge-danger'
          }`}
        >
          {row.estadoProveedor === 'A' ? 'ACTIVO' : 'INACTIVO'}
        </span>
      ),
    },
    {
      header: 'Acciones',
      width: '150px',
      render: (row) => (
        <div className="table-actions">
          <button
            className="action-btn btn-info"
            onClick={() => navigate(`/proveedores/${row.id}`)}
            title="Ver detalles"
          >
            <FaEye />
          </button>
          <button
            className="action-btn btn-edit"
            onClick={() => navigate(`/proveedores/${row.id}/editar`)}
            title="Editar"
          >
            <FaEdit />
          </button>
          <button
            className="action-btn btn-delete"
            onClick={() => setDeleteModal({ isOpen: true, proveedor: row })}
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
        title="Proveedores"
        subtitle="Gestión de proveedores del sistema"
        actions={
          <Button
            icon={<FaPlus />}
            onClick={() => navigate('/proveedores/nuevo')}
          >
            Nuevo Proveedor
          </Button>
        }
      >
        <Table columns={columns} data={proveedores} loading={loading} />
      </Card>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, proveedor: null })}
        title="Confirmar Eliminación"
        size="small"
      >
        <p>
          ¿Estás seguro de eliminar el proveedor{' '}
          <strong>{deleteModal.proveedor?.razonSocial}</strong>?
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <Button
            variant="danger"
            onClick={handleDelete}
            fullWidth
          >
            Eliminar
          </Button>
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ isOpen: false, proveedor: null })}
            fullWidth
          >
            Cancelar
          </Button>
        </div>
      </Modal>

      <style>{`
        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .badge-success {
          background: #d1fae5;
          color: #065f46;
        }
        .badge-danger {
          background: #fee2e2;
          color: #991b1b;
        }
        .table-actions {
          display: flex;
          gap: 0.5rem;
        }
        .action-btn {
          padding: 0.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          color: white;
        }
        .btn-info {
          background: #3b82f6;
        }
        .btn-info:hover {
          background: #2563eb;
        }
        .btn-edit {
          background: #10b981;
        }
        .btn-edit:hover {
          background: #059669;
        }
        .btn-delete {
          background: #ef4444;
        }
        .btn-delete:hover {
          background: #dc2626;
        }
        .page-container {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProveedoresList;
