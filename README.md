# Sistema de Gestión de Proveedores - Frontend

Frontend desarrollado con React + Vite para el sistema de gestión de proveedores con arquitectura de microservicios.

## 🚀 Características

- ✅ Autenticación JWT con registro y login
- 👥 Gestión de usuarios y roles (Admin)
- 📦 CRUD completo de proveedores
- 🏷️ Gestión de tipos de proveedor
- � Gestión de items por proveedor
- �🛒 Gestión completa de órdenes de compra
- 📊 Generación de reportes avanzados
- 📈 Dashboard con estadísticas en tiempo real
- 📱 Diseño responsive y moderno
- 🎨 Interfaz intuitiva y profesional

## 🛠️ Tecnologías

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **Zustand** - Gestión de estado global
- **React Hook Form** - Manejo de formularios
- **React Icons** - Iconografía
- **Recharts** - Gráficos y visualizaciones
- **React Toastify** - Notificaciones
- **Date-fns** - Manejo de fechas

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Backend ejecutándose en puerto 8080 (API Gateway)
- Servicios de backend activos:
  - Eureka Server (8761)
  - API Gateway (8080)
  - Auth Service (8084)
  - Proveedor Service (8082)
  - Compra Service (8081)
  - Reportes Service (8083)

## 🔧 Instalación

```bash
# Clonar el repositorio
cd modulo-proveedores-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno (opcional)
# Copiar .env.example a .env y ajustar si es necesario
cp .env.example .env

# Ejecutar en desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:3000
```

## 🏗️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Compila para producción
npm run preview      # Previsualiza build de producción

# Calidad de código
npm run lint         # Ejecuta ESLint
```

## 🌐 Estructura del Proyecto

```
modulo-proveedores-frontend/
├── public/              # Archivos estáticos
├── src/
│   ├── api/            # Configuración de Axios y servicios
│   │   ├── axios.js    # Instancia de Axios con interceptores
│   │   └── services.js # Servicios de API por módulo
│   ├── components/     # Componentes reutilizables
│   │   ├── Auth/       # Componentes de autenticación
│   │   ├── Common/     # Componentes comunes (Button, Input, Table, etc.)
│   │   └── Layout/     # Layout principal y navegación
│   ├── pages/          # Páginas de la aplicación
│   │   ├── Auth/       # Login y Registro
│   │   ├── Dashboard/  # Dashboard principal
│   │   ├── Proveedores/# Gestión de proveedores
│   │   ├── TiposProveedor/
│   │   ├── ProveedorItems/
│   │   ├── Compras/    # Gestión de compras
│   │   ├── Reportes/   # Reportes del sistema
│   │   └── Usuarios/   # Gestión de usuarios (Admin)
│   ├── store/          # Estado global con Zustand
│   │   └── authStore.js
│   ├── App.jsx         # Componente principal con rutas
│   ├── main.jsx        # Punto de entrada
│   └── index.css       # Estilos globales
├── .env                # Variables de entorno
├── .env.example        # Ejemplo de variables de entorno
├── vite.config.js      # Configuración de Vite
├── package.json        # Dependencias y scripts
└── README.md           # Este archivo
```

## 🔐 Autenticación

El sistema implementa autenticación basada en JWT:

1. **Registro**: Los usuarios pueden crear una cuenta nueva
2. **Login**: Autenticación con usuario y contraseña
3. **Token JWT**: Se almacena en localStorage
4. **Interceptor**: Agrega automáticamente el token a todas las peticiones
5. **Sesión persistente**: El estado se mantiene entre recargas
6. **Logout**: Limpia el token y redirige al login

## 📡 Módulos y Funcionalidades

### 🏠 Dashboard
- Estadísticas generales del sistema
- Accesos rápidos a funcionalidades principales
- Información del sistema

### 👤 Autenticación
- Registro de nuevos usuarios
- Login con validación
- Gestión de sesión

### 🚚 Proveedores
- Listado completo de proveedores
- Crear nuevo proveedor
- Editar información de proveedor
- Eliminar proveedor
- Búsqueda y filtros

### 🏷️ Tipos de Proveedor
- CRUD completo de tipos
- Gestión de estados

### 📦 Items de Proveedor
- Gestión de productos/servicios por proveedor
- Precios y especificaciones
- Validación de existencia

### 🛒 Órdenes de Compra
- Crear nueva orden con múltiples items
- Editar orden existente
- Ver detalles completos
- Cambiar estados (Borrador, Pendiente, Aprobada, Rechazada)
- Cálculo automático de totales
- Gestión de descuentos e impuestos

### 📊 Reportes
- Proveedores más usados
- Items más comprados
- Órdenes por estado
- Órdenes por proveedor
- Órdenes por mes
- Proveedores con items
- Visualización de datos en JSON

### � Usuarios (Solo Admin)
- Listado de usuarios del sistema
- Asignación de roles
- Gestión de permisos

## 🎨 Características de UI/UX

- **Diseño Responsive**: Adaptable a móviles, tablets y desktop
- **Notificaciones Toast**: Feedback visual de acciones
- **Modales**: Confirmaciones y formularios flotantes
- **Tablas Dinámicas**: Con acciones por fila
- **Formularios Validados**: Con mensajes de error claros
- **Navegación Intuitiva**: Sidebar y navbar
- **Estados de Carga**: Indicadores visuales
- **Badges de Estado**: Códigos de color para estados
- **Tema Moderno**: Colores y sombras profesionales

## 🔗 Conexión con Backend

El frontend se conecta al API Gateway en `http://localhost:8080`:

- **Auth Service**: `/api/v1/auth/**`
  - POST `/login` - Iniciar sesión
  - POST `/signup` - Registrarse
  - GET `/admin/users` - Listar usuarios
  - POST `/admin/users/{username}/roles` - Asignar roles

- **Proveedor Service**: `/api/v1/proveedores/**`
  - GET `/` - Listar proveedores
  - POST `/` - Crear proveedor
  - GET `/{id}` - Obtener proveedor
  - PUT `/{id}` - Actualizar proveedor
  - DELETE `/{id}` - Eliminar proveedor

- **Compra Service**: `/api/v1/compras/**`
  - GET `/` - Listar compras
  - POST `/` - Crear compra
  - GET `/{id}` - Obtener compra
  - PUT `/update/{id}` - Actualizar compra
  - PATCH `/{id}/estado` - Cambiar estado
  - DELETE `/delete/{id}` - Eliminar compra

- **Reportes Service**: `/api/v1/reportes/**`
  - GET `/` - Listar reportes
  - POST `/` - Crear reporte
  - GET `/generar/proveedores-mas-usados`
  - GET `/generar/items-mas-comprados`
  - GET `/generar/ordenes-por-estado`
  - GET `/generar/ordenes-por-proveedor/{id}`
  - GET `/generar/ordenes-por-mes`
  - GET `/generar/proveedores-con-items`

## 🚀 Despliegue

```bash
# Compilar para producción
npm run build

# La carpeta dist/ contiene los archivos estáticos
# Puede ser desplegado en cualquier servidor web (Nginx, Apache, Vercel, Netlify, etc.)
```

## 🐛 Solución de Problemas

### Error de conexión con backend
- Verificar que el API Gateway esté corriendo en puerto 8080
- Verificar que todos los microservicios estén activos
- Revisar la variable VITE_API_URL en .env

### Error de autenticación
- Limpiar localStorage: `localStorage.clear()`
- Verificar que el servicio de autenticación esté activo
- Revisar la configuración de JWT en el backend

### Dependencias
- Eliminar node_modules y reinstalar: `rm -rf node_modules && npm install`
- Limpiar caché de npm: `npm cache clean --force`

## 📝 Notas de Desarrollo

- El proyecto usa ESLint para mantener calidad de código
- Los componentes siguen el patrón de componentes funcionales
- El estado global se maneja con Zustand (más ligero que Redux)
- Las peticiones HTTP usan interceptores para manejo automático de tokens
- Los formularios usan validación en tiempo real

## 🤝 Contribuir

1. Crear una nueva rama para la funcionalidad
2. Hacer commit de los cambios
3. Push a la rama
4. Crear un Pull Request

## 📄 Licencia

Este proyecto es parte del trabajo académico del Grupo 5 - Universidad El Bosque

## 👨‍💻 Desarrollado por

**Grupo 5 - Universidad El Bosque**

Sistema de Gestión de Proveedores con Microservicios
Noviembre 2025
