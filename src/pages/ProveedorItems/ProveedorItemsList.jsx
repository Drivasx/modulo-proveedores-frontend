import { useEffect, useState } from 'react';
import { proveedorItemsService, proveedoresService } from '../../api/services';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import Input from '../../components/Common/Input';

const ProveedorItemsList = () => {
  const [items, setItems] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, item: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [formData, setFormData] = useState({
    idProveedor: '',
    referenciaElemento: '',
    nombreElemento: '',
    descripcionElemento: '',
    unidadElemento: '',
    precioVenta: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [itemsData, proveedoresData] = await Promise.all([
        proveedorItemsService.getAll(),
        proveedoresService.getAll(),
      ]);
      setItems(itemsData);
      setProveedores(proveedoresData);
    } catch (error) {
      toast.error('Error al cargar items');
    } finally {
      setLoading(false);
    }
  };

  const getProveedorNombre = (idProveedor) => {
    const proveedor = proveedores.find((p) => p.id === idProveedor);
    return proveedor?.razonSocial || 'N/A';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que se haya seleccionado un proveedor
    if (!formData.idProveedor || formData.idProveedor === '') {
      toast.error('Debe seleccionar un proveedor');
      return;
    }

    console.log('📤 Enviando datos:', formData);
    
    try {
      if (modal.item) {
        await proveedorItemsService.update(modal.item.id, formData);
        toast.success('Item actualizado exitosamente');
      } else {
        await proveedorItemsService.create(formData);
        toast.success('Item creado exitosamente');
      }
      loadData();
      closeModal();
    } catch (error) {
      console.error('❌ Error completo:', error);
      console.error('❌ Respuesta del servidor:', error.response?.data);
      const mensaje = error.response?.data?.message || error.response?.data?.error || 'Error al guardar el item';
      toast.error(mensaje);
    }
  };

  const handleDelete = async () => {
    try {
      await proveedorItemsService.delete(deleteModal.item.id);
      toast.success('Item eliminado exitosamente');
      loadData();
      setDeleteModal({ isOpen: false, item: null });
    } catch (error) {
      toast.error('Error al eliminar el item');
    }
  };

  const openModal = (item = null) => {
    setFormData(
      item || {
        idProveedor: '',
        referenciaElemento: '',
        nombreElemento: '',
        descripcionElemento: '',
        unidadElemento: '',
        precioVenta: 0,
      }
    );
    setModal({ isOpen: true, item });
  };

  const closeModal = () => {
    setModal({ isOpen: false, item: null });
    setFormData({
      idProveedor: '',
      referenciaElemento: '',
      nombreElemento: '',
      descripcionElemento: '',
      unidadElemento: '',
      precioVenta: 0,
    });
  };

  const columns = [
    { header: 'ID', accessor: 'id', width: '60px' },
    { header: 'Proveedor', render: (row) => getProveedorNombre(row.idProveedor) },
    { header: 'Referencia', accessor: 'referenciaElemento' },
    { header: 'Nombre', accessor: 'nombreElemento' },
    { header: 'Unidad', accessor: 'unidadElemento' },
    {
      header: 'Precio',
      render: (row) => `$${Number(row.precioVenta).toLocaleString()}`,
    },
    {
      header: 'Acciones',
      width: '120px',
      render: (row) => (
        <div className="table-actions">
          <button className="action-btn btn-edit" onClick={() => openModal(row)}>
            <FaEdit />
          </button>
          <button className="action-btn btn-delete" onClick={() => setDeleteModal({ isOpen: true, item: row })}>
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <Card
        title="Items de Proveedor"
        subtitle="Gestión de items disponibles por proveedor"
        actions={<Button icon={<FaPlus />} onClick={() => openModal()}>Nuevo Item</Button>}
      >
        <Table columns={columns} data={items} loading={loading} />
      </Card>

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.item ? 'Editar Item' : 'Nuevo Item'}
        size="medium"
      >
        <form onSubmit={handleSubmit}>
          <div>
            <label className="input-label">Proveedor *</label>
            <select
              value={formData.idProveedor}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, idProveedor: value ? parseInt(value, 10) : '' });
              }}
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
            label="Referencia"
            value={formData.referenciaElemento}
            onChange={(e) => setFormData({ ...formData, referenciaElemento: e.target.value })}
            required
          />
          <Input
            label="Nombre"
            value={formData.nombreElemento}
            onChange={(e) => setFormData({ ...formData, nombreElemento: e.target.value })}
            required
          />
          <Input
            label="Descripción"
            value={formData.descripcionElemento}
            onChange={(e) => setFormData({ ...formData, descripcionElemento: e.target.value })}
          />
          <Input
            label="Unidad"
            value={formData.unidadElemento}
            onChange={(e) => setFormData({ ...formData, unidadElemento: e.target.value })}
            required
          />
          <Input
            label="Precio de Venta"
            type="number"
            step="0.01"
            min="0"
            value={formData.precioVenta}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setFormData({ ...formData, precioVenta: isNaN(value) ? 0 : value });
            }}
            required
          />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <Button type="submit" fullWidth>{modal.item ? 'Actualizar' : 'Crear'}</Button>
            <Button type="button" variant="secondary" onClick={closeModal} fullWidth>Cancelar</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        title="Confirmar Eliminación"
        size="small"
      >
        <p>¿Estás seguro de eliminar el item <strong>{deleteModal.item?.nombreElemento}</strong>?</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <Button variant="danger" onClick={handleDelete} fullWidth>Eliminar</Button>
          <Button variant="secondary" onClick={() => setDeleteModal({ isOpen: false, item: null })} fullWidth>
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProveedorItemsList;
