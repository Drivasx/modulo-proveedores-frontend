import { useEffect, useState } from 'react';
import { usuariosService } from '../../api/services';
import { toast } from 'react-toastify';
import Card from '../../components/Common/Card';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import Button from '../../components/Common/Button';
import { FaUserShield } from 'react-icons/fa';

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rolesModal, setRolesModal] = useState({ isOpen: false, usuario: null });
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usuariosData, rolesData] = await Promise.all([
        usuariosService.getAll(),
        usuariosService.getAllRoles(),
      ]);
      setUsuarios(usuariosData);
      setRoles(rolesData);
    } catch (error) {
      toast.error('Error al cargar usuarios. Asegúrese de tener permisos de administrador.');
    } finally {
      setLoading(false);
    }
  };

  const openRolesModal = (usuario) => {
    setSelectedRoles(usuario.roles || []);
    setRolesModal({ isOpen: true, usuario });
  };

  const handleAssignRoles = async () => {
    try {
      await usuariosService.assignRoles(rolesModal.usuario.username, selectedRoles);
      toast.success('Roles asignados exitosamente');
      loadData();
      setRolesModal({ isOpen: false, usuario: null });
    } catch (error) {
      toast.error('Error al asignar roles');
    }
  };

  const toggleRole = (roleName) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
  };

  const columns = [
    { header: 'ID', accessor: 'id', width: '60px' },
    { header: 'Usuario', accessor: 'username' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Roles',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
          {row.roles && row.roles.length > 0 ? (
            row.roles.map((role, index) => (
              <span key={index} className="badge badge-success">
                {role}
              </span>
            ))
          ) : (
            <span className="badge badge-secondary">Sin roles</span>
          )}
        </div>
      ),
    },
    {
      header: 'Estado',
      render: (row) => (
        <span
          className={`badge ${
            row.estado === 'ACTIVO' ? 'badge-success' : 'badge-danger'
          }`}
        >
          {row.estado || 'ACTIVO'}
        </span>
      ),
    },
    {
      header: 'Acciones',
      width: '100px',
      render: (row) => (
        <button
          className="action-btn btn-info"
          onClick={() => openRolesModal(row)}
          title="Asignar roles"
        >
          <FaUserShield />
        </button>
      ),
    },
  ];

  return (
    <div className="page-container">
      <Card
        title="Gestión de Usuarios"
        subtitle="Administración de usuarios y roles del sistema (Solo Administradores)"
      >
        <Table columns={columns} data={usuarios} loading={loading} />
      </Card>

      <Modal
        isOpen={rolesModal.isOpen}
        onClose={() => setRolesModal({ isOpen: false, usuario: null })}
        title={`Asignar Roles - ${rolesModal.usuario?.username}`}
        size="small"
      >
        <div>
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Seleccione los roles para el usuario
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {roles.map((rol) => (
              <label
                key={rol.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  background: 'var(--light-bg)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(rol.nombre)}
                  onChange={() => toggleRole(rol.nombre)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontWeight: '600' }}>{rol.nombre}</div>
                  {rol.descripcion && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {rol.descripcion}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <Button onClick={handleAssignRoles} fullWidth>
              Asignar Roles
            </Button>
            <Button
              variant="secondary"
              onClick={() => setRolesModal({ isOpen: false, usuario: null })}
              fullWidth
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsuariosList;
