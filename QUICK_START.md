# 🚀 Guía de Inicio Rápido

## Pasos para ejecutar el proyecto

### 1. Instalar dependencias (ya realizado)
```bash
npm install
```

### 2. Iniciar el backend
Asegúrate de que todos los servicios del backend estén corriendo:
```bash
# Desde el directorio modulo-proveedores-g5
docker-compose up -d  # Para iniciar las bases de datos

# Luego inicia cada microservicio:
# - Eureka Server (puerto 8761)
# - API Gateway (puerto 8080)
# - Auth Service (puerto 8084)
# - Proveedor Service (puerto 8082)
# - Compra Service (puerto 8081)
# - Reportes Service (puerto 8083)
```

### 3. Iniciar el frontend
```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

## 📝 Credenciales de prueba

Para probar el sistema, primero debes registrar un usuario:

1. Ve a http://localhost:3000/register
2. Completa el formulario de registro
3. Inicia sesión con tus credenciales

## 🎯 Flujo de uso recomendado

### 1. Configuración Inicial

#### a) Crear Tipos de Proveedor
- Ir a **Tipos Proveedor** en el menú lateral
- Crear tipos como: "Servicios", "Productos", "Insumos", etc.

#### b) Registrar Proveedores
- Ir a **Proveedores** → **Nuevo Proveedor**
- Completar la información
- Asignar un tipo de proveedor

#### c) Agregar Items
- Ir a **Items** → **Nuevo Item**
- Agregar productos/servicios que ofrece cada proveedor
- Definir precios y especificaciones

### 2. Gestión de Compras

#### Crear una Orden de Compra
1. Ir a **Compras** → **Nueva Compra**
2. Seleccionar proveedor
3. Agregar items con cantidades y costos
4. Los totales se calculan automáticamente
5. Guardar como BORRADOR o cambiar estado

#### Estados de Orden
- **BORRADOR**: En edición
- **PENDIENTE**: Esperando aprobación
- **APROBADA**: Orden confirmada
- **RECHAZADA**: Orden no aprobada

### 3. Generación de Reportes

Ir a **Generar Reportes** para obtener:
- Proveedores más utilizados
- Items más comprados
- Órdenes filtradas por estado/proveedor/mes
- Lista de proveedores con sus items

### 4. Gestión de Usuarios (Solo Admin)

Si tienes rol de administrador:
- Ir a **Usuarios**
- Ver todos los usuarios del sistema
- Asignar roles (ADMIN, USER, etc.)

## 🎨 Estructura de Navegación

```
Dashboard (/)
├── Proveedores
│   ├── Lista de proveedores
│   ├── Nuevo proveedor
│   └── Editar proveedor
├── Tipos Proveedor
│   └── CRUD de tipos
├── Items
│   └── CRUD de items por proveedor
├── Compras
│   ├── Lista de compras
│   ├── Nueva compra
│   ├── Editar compra
│   └── Ver detalle
├── Reportes
│   ├── Lista de reportes generados
│   └── Generar nuevos reportes
└── Usuarios (Admin)
    └── Gestión de usuarios y roles
```

## ⚡ Funcionalidades Destacadas

### Dashboard
- Visualiza estadísticas generales
- Acceso rápido a funciones principales
- Información del sistema

### Proveedores
- Búsqueda en tabla
- Filtros por estado
- Edición inline
- Eliminación con confirmación

### Órdenes de Compra
- Múltiples items por orden
- Cálculo automático de totales
- Gestión de descuentos e impuestos
- Cambio de estados
- Vista detallada de cada orden

### Reportes
- Generación en tiempo real
- Múltiples tipos de análisis
- Exportación visual de datos
- Historial de reportes

## 🔧 Configuración Avanzada

### Variables de Entorno (.env)
```env
VITE_API_URL=http://localhost:8080
```

Si el backend está en otra URL, modifica este archivo.

### Proxy de Desarrollo
El proxy está configurado en `vite.config.js` para redirigir `/api` a `http://localhost:8080`

## 🐛 Problemas Comunes

### Error: "Cannot connect to backend"
**Solución**: Verifica que el API Gateway esté corriendo en puerto 8080

### Error: "Unauthorized"
**Solución**: 
1. Limpia localStorage: Abre la consola del navegador y ejecuta `localStorage.clear()`
2. Vuelve a iniciar sesión

### Los reportes no se generan
**Solución**: Verifica que el servicio de reportes esté activo (puerto 8083)

### No puedo ver usuarios
**Solución**: La gestión de usuarios requiere rol de ADMIN. Si no tienes este rol, contacta a un administrador.

## 📊 Datos de Ejemplo

Para poblar la base de datos con datos de prueba, puedes:

1. Crear manualmente a través de la interfaz
2. Usar los scripts SQL en `init-scripts/` del backend
3. Usar la API directamente con herramientas como Postman

## 🎓 Tips de Uso

1. **Usa estados de orden**: Comienza con BORRADOR para editar libremente
2. **Verifica totales**: Los cálculos son automáticos pero siempre revisa
3. **Genera reportes regularmente**: Para análisis de datos
4. **Mantén items actualizados**: Con precios correctos
5. **Asigna roles apropiadamente**: Para seguridad del sistema

## 📞 Soporte

Si encuentras problemas o tienes preguntas:
1. Revisa la consola del navegador (F12)
2. Revisa los logs del backend
3. Verifica que todos los servicios estén activos
4. Consulta el README.md principal

## ✅ Checklist de Inicio

- [ ] Backend ejecutándose (todos los microservicios)
- [ ] Bases de datos activas (PostgreSQL y MongoDB)
- [ ] Frontend compilado (`npm install` completado)
- [ ] Variables de entorno configuradas
- [ ] Usuario registrado en el sistema
- [ ] Al menos un tipo de proveedor creado
- [ ] Al menos un proveedor registrado
- [ ] Al menos un item creado

¡Listo! Ya puedes comenzar a usar el sistema completo. 🎉
