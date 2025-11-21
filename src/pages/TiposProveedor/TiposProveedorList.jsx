import { useEffect, useState } from 'react';
import { tiposProveedorService } from '../../api/services';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import Input from '../../components/Common/Input';

const TiposProveedorList = () => {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, tipo: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, tipo: null });
  const [formData, setFormData] = useState({ descripcion: '', estado: 'ACTIVO' });

  useEffect(() => {
    loadTipos();
  }, []);

  const loadTipos = async () => {
    try {
      const data = await tiposProveedorService.getAll();
      setTipos(data);
    } catch (error) {
      toast.error('Error al cargar tipos de proveedor');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal.tipo) {
        await tiposProveedorService.update(modal.tipo.id, formData);
        toast.success('Tipo actualizado exitosamente');
      } else {
        await tiposProveedorService.create(formData);
        toast.success('Tipo creado exitosamente');
      }
      loadTipos();
      setModal({ isOpen: false, tipo: null });
      setFormData({ descripcion: '', estado: 'ACTIVO' });
    } catch (error) {
      toast.error('Error al guardar el tipo');
    }
  };

  const handleDelete = async () => {
    try {
      await tiposProveedorService.delete(deleteModal.tipo.id);
      toast.success('Tipo eliminado exitosamente');
      loadTipos();
      setDeleteModal({ isOpen: false, tipo: null });
    } catch (error) {
      toast.error('Error al eliminar el tipo');
    }
  };

  const openModal = (tipo = null) => {
    setFormData(tipo || { descripcion: '', estado: 'ACTIVO' });
    setModal({ isOpen: true, tipo });
  };

  const columns = [
    { header: 'ID', accessor: 'id', width: '80px' },
    { header: 'Descripción', accessor: 'descripcion' },
    {
      header: 'Estado',
      render: (row) => (
        <span className={`badge ${row.estado === 'ACTIVO' ? 'badge-success' : 'badge-danger'}`}>
          {row.estado}
        </span>
      ),
    },
    {
      header: 'Acciones',
      width: '120px',
      render: (row) => (
        <div className="table-actions">
          <button className="action-btn btn-edit" onClick={() => openModal(row)}>
            <FaEdit />
          </button>
          <button className="action-btn btn-delete" onClick={() => setDeleteModal({ isOpen: true, tipo: row })}>
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <Card
        title="Tipos de Proveedor"
        subtitle="Gestión de tipos de proveedor"
        actions={<Button icon={<FaPlus />} onClick={() => openModal()}>Nuevo Tipo</Button>}
      >
        <Table columns={columns} data={tipos} loading={loading} />
      </Card>

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, tipo: null })}
        title={modal.tipo ? 'Editar Tipo' : 'Nuevo Tipo'}
        size="small"
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            required
          />
          <div>
            <label className="input-label">Estado</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              className="input"
            >
              <option value="ACTIVO">ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <Button type="submit" fullWidth>{modal.tipo ? 'Actualizar' : 'Crear'}</Button>
            <Button type="button" variant="secondary" onClick={() => setModal({ isOpen: false, tipo: null })} fullWidth>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, tipo: null })}
        title="Confirmar Eliminación"
        size="small"
      >
        <p>¿Estás seguro de eliminar el tipo <strong>{deleteModal.tipo?.descripcion}</strong>?</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <Button variant="danger" onClick={handleDelete} fullWidth>Eliminar</Button>
          <Button variant="secondary" onClick={() => setDeleteModal({ isOpen: false, tipo: null })} fullWidth>
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TiposProveedorList;
