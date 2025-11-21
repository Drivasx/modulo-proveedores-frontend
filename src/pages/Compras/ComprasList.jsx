import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { comprasService, proveedoresService } from '../../api/services';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';

const ComprasList = () => {
  const navigate = useNavigate();
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, compra: null });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [comprasData, proveedoresData] = await Promise.all([
        comprasService.getAll(),
        proveedoresService.getAll(),
      ]);
      setCompras(comprasData);
      setProveedores(proveedoresData);
    } catch (error) {
      toast.error('Error al cargar las compras');
    } finally {
      setLoading(false);
    }
  };

  const getProveedorNombre = (idProveedor) => {
    const proveedor = proveedores.find((p) => p.id === idProveedor);
    return proveedor?.razonSocial || 'N/A';
  };

  const handleDelete = async () => {
    try {
      await comprasService.delete(deleteModal.compra.id);
      toast.success('Compra eliminada exitosamente');
      loadData();
      setDeleteModal({ isOpen: false, compra: null });
    } catch (error) {
      toast.error('Error al eliminar la compra');
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      BORRADOR: 'badge-secondary',
      PENDIENTE: 'badge-warning',
      APROBADA: 'badge-success',
      RECHAZADA: 'badge-danger',
    };
    return badges[estado] || 'badge-secondary';
  };

  const columns = [
    { header: 'ID', accessor: 'id', width: '60px' },
    {
      header: 'Fecha',
      render: (row) => format(new Date(row.fechaCompra), 'dd/MM/yyyy'),
    },
    { header: 'Proveedor', render: (row) => getProveedorNombre(row.idProveedor) },
    {
      header: 'Valor Neto',
      render: (row) => `$${Number(row.valorNeto).toLocaleString()}`,
    },
    {
      header: 'Estado',
      render: (row) => (
        <span className={`badge ${getEstadoBadge(row.estadoDocumento)}`}>
          {row.estadoDocumento}
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
            onClick={() => navigate(`/compras/${row.id}`)}
            title="Ver detalles"
          >
            <FaEye />
          </button>
          <button
            className="action-btn btn-edit"
            onClick={() => navigate(`/compras/${row.id}/editar`)}
            title="Editar"
          >
            <FaEdit />
          </button>
          <button
            className="action-btn btn-delete"
            onClick={() => setDeleteModal({ isOpen: true, compra: row })}
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
        title="Órdenes de Compra"
        subtitle="Gestión de órdenes de compra del sistema"
        actions={
          <Button icon={<FaPlus />} onClick={() => navigate('/compras/nueva')}>
            Nueva Compra
          </Button>
        }
      >
        <Table columns={columns} data={compras} loading={loading} />
      </Card>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, compra: null })}
        title="Confirmar Eliminación"
        size="small"
      >
        <p>¿Estás seguro de eliminar la compra <strong>#{deleteModal.compra?.id}</strong>?</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <Button variant="danger" onClick={handleDelete} fullWidth>
            Eliminar
          </Button>
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ isOpen: false, compra: null })}
            fullWidth
          >
            Cancelar
          </Button>
        </div>
      </Modal>

      <style>{`
        .badge-secondary { background: #e2e8f0; color: #475569; }
        .badge-warning { background: #fef3c7; color: #92400e; }
      `}</style>
    </div>
  );
};

export default ComprasList;
