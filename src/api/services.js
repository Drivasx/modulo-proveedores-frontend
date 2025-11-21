import api from './axios';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/v1/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/api/v1/auth/signup', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const proveedoresService = {
  getAll: async () => {
    const response = await api.get('/api/v1/proveedores');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/v1/proveedores/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/api/v1/proveedores', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/v1/proveedores/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/v1/proveedores/${id}`);
    return response.data;
  },
};

export const tiposProveedorService = {
  getAll: async () => {
    const response = await api.get('/api/v1/proveedores/tipos-proveedor');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/v1/proveedores/tipos-proveedor/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/api/v1/proveedores/tipos-proveedor', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/v1/proveedores/tipos-proveedor/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/v1/proveedores/tipos-proveedor/${id}`);
    return response.data;
  },
};

export const proveedorItemsService = {
  getAll: async () => {
    const response = await api.get('/api/v1/proveedores/proveedor-items');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/v1/proveedores/proveedor-items/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/api/v1/proveedores/proveedor-items', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/v1/proveedores/proveedor-items/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/v1/proveedores/proveedor-items/${id}`);
    return response.data;
  },

  validate: async (id) => {
    const response = await api.get(`/api/v1/proveedores/proveedor-items/validate/${id}`);
    return response.data;
  },
};

export const comprasService = {
  getAll: async () => {
    const response = await api.get('/api/v1/compras');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/v1/compras/${id}`);
    return response.data;
  },

  getByProveedor: async (idProveedor) => {
    const response = await api.get(`/api/v1/compras/proveedor/${idProveedor}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/api/v1/compras', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/v1/compras/update/${id}`, data);
    return response.data;
  },

  updateEstado: async (id, nuevoEstado) => {
    const response = await api.patch(`/api/v1/compras/${id}/estado`, nuevoEstado);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/v1/compras/delete/${id}`);
    return response.data;
  },
};

export const reportesService = {
  getAll: async () => {
    const response = await api.get('/api/v1/reportes');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/v1/reportes/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/api/v1/reportes', data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/v1/reportes/${id}`);
    return response.data;
  },

  // Reportes específicos
  proveedoresMasUsados: async () => {
    const response = await api.get('/api/v1/reportes/generar/proveedores-mas-usados');
    return response.data;
  },

  itemsMasComprados: async () => {
    const response = await api.get('/api/v1/reportes/generar/items-mas-comprados');
    return response.data;
  },

  ordenesPorEstado: async (estado) => {
    const response = await api.get(`/api/v1/reportes/generar/ordenes-por-estado?estado=${estado}`);
    return response.data;
  },

  ordenesPorProveedor: async (idProveedor) => {
    const response = await api.get(`/api/v1/reportes/generar/ordenes-por-proveedor/${idProveedor}`);
    return response.data;
  },

  ordenesPorMes: async (mes, anio) => {
    const response = await api.get(`/api/v1/reportes/generar/ordenes-por-mes?mes=${mes}&anio=${anio}`);
    return response.data;
  },

  proveedoresConItems: async () => {
    const response = await api.get('/api/v1/reportes/generar/proveedores-con-items');
    return response.data;
  },
};

export const usuariosService = {
  getAll: async () => {
    const response = await api.get('/api/v1/auth/admin/users');
    return response.data;
  },

  getUserRoles: async (username) => {
    const response = await api.get(`/api/v1/auth/admin/users/${username}/roles`);
    return response.data;
  },

  getAllRoles: async () => {
    const response = await api.get('/api/v1/auth/admin/roles');
    return response.data;
  },

  getUsersByRole: async (roleName) => {
    const response = await api.get(`/api/v1/auth/admin/roles/${roleName}/users`);
    return response.data;
  },

  assignRoles: async (username, roles) => {
    const response = await api.post(`/api/v1/auth/admin/users/${username}/roles`, roles);
    return response.data;
  },
};
