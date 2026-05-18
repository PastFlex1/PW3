# 📦 MiInventarioExpress - Unidad 3 (SPA Full-Stack Vue 3 + Express + MongoDB)

MiInventarioExpress ha evolucionado hacia una **Single Page Application (SPA)** de última generación construida sobre la potente combinación del stack **MEVN (MongoDB, Express, Vue 3 y Node.js)**. 

Este proyecto demuestra la implementación de patrones arquitectónicos avanzados en el lado del cliente (Vite, Vue Router 4 con Lazy Loading, `<Suspense>`, Composables de manejo HTTP con reintentos y cancelación, reactividad profunda) acoplados con un backend RESTful robusto en Express con validaciones estrictas y Mongoose.

---

## 🚀 Arquitectura y Características Principales

### 🖥️ 1. Frontend SPA (Vue 3 + Vite + Composition API)
Ubicado en el subdirectorio `/frontend`, representa una aplicación web moderna de alto rendimiento:
* **Enrutamiento Avanzado (`vue-router@4`)**: Implementación de un sistema de navegación SPA fluido con transiciones instantáneas sin recarga del navegador.
* **Carga Perezosa (*Lazy Loading*) y Code Splitting**: Todas las vistas secundarias (`/about`, `/cart`, `/product/:id`, `/product/new`, `/product/:id/edit`, `/404`) se importan asíncronamente mediante `() => import(...)`. Durante la construcción de producción (`npm run build`), Vite genera archivos `.js` y `.css` independientes (*chunks*) para minimizar el tamaño del paquete inicial.
* **Transiciones con `<Suspense>`**: El contenedor de rutas está envuelto en un componente `<Suspense>`, mostrando automáticamente una hermosa animación giratoria (*spinner*) durante la descarga e inicialización de módulos asíncronos.
* **Búsqueda y Filtrado Reactivo Instantáneo**: La vista del catálogo (`HomeView.vue`) permite buscar productos en vivo por coincidencia en el nombre o descripción, filtrar por categoría y por nivel de stock. Toda la lógica está respaldada por **Propiedades Computadas (`computed`)**, filtrando instantáneamente en memoria sin generar tráfico redundante hacia el servidor.
* **Desacoplamiento y Eventos Personalizados**: Tarjetas de producto (`ProductCard.vue`) puramente presentacionales que se comunican con la vista padre emitiendo el evento personalizado `added-to-cart`.
* **Notificaciones Flotantes (*Toasts*) Animadas**: Confirmaciones visuales interactivas tipo *glassmorphism* al añadir ítems al carrito.
* **Estado Global del Carrito con Persistencia**: El composable `useCart.js` mantiene sincronizado el estado del carrito de compras con el `localStorage` mediante observadores profundos (`watch` con `{ deep: true }`). Calcula subtotales, 15% de IVA y totales de forma 100% reactiva y valida límites de stock antes de permitir incrementos.
* **Composables HTTP Avanzados (`useApi` y `useProducts`)**: Capa de abstracción de red que gestiona automáticamente los estados `data`, `loading` y `error`. Implementa **1 reintento automático** si ocurre un fallo de conexión y **cancelación de peticiones en vuelo** mediante `AbortController` al desmontar vistas o cambiar de página.
* **Formulario Inteligente de Alta y Edición**: Vista unificada (`ProductFormView.vue`) para crear y editar productos con validaciones estrictas en el cliente (nombre obligatorio, precio > 0, categoría obligatoria desde la API, stock ≥ 0 y formato de URL fotográfica válida).

### ⚙️ 2. Backend RESTful API (Express + MongoDB)
Ubicado en la raíz del proyecto, ofrece servicios de datos altamente seguros:
* **Modelos Mongoose con Virtuals Habilitados**: Los esquemas `Product` y `Category` tienen habilitada la transformación `toJSON: { virtuals: true }` para devolver un campo `id` limpio (cadena) basado en el `_id` nativo de MongoDB.
* **Validación de Datos en Controladores**: Uso riguroso de `express-validator` para requerir campos y de `mongoose.isValidObjectId` para evitar errores del servidor ante identificadores malformados.
* **Manejo Estricto de Errores HTTP**: Respuestas semánticas JSON con códigos HTTP adecuados (400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Error). Además, un middleware global maneja todas las rutas no existentes devolviendo un objeto JSON `{ error: "Endpoint no encontrado" }`.
* **Autenticación REST con Cookies Protegidas**: Endpoints de login (`POST /api/auth/login`), logout (`POST /api/auth/logout`) y verificación de sesión (`GET /api/auth/session`) diseñados para aplicaciones SPA con transmisión de credenciales (`credentials: 'include'`).
* **Seeding de Datos Inicial**: El script `seed.js` limpia y puebla la base de datos con 5 categorías realistas y 12 productos con descripciones detalladas, diferentes niveles de stock e imágenes de alta calidad desde Unsplash.

---

## 🛠️ Tecnologías Utilizadas

* **Motor de Frontend**: Vue 3 (SFC, Script Setup, Composition API)
* **Empaquetador y Servidor Dev**: Vite
* **Enrutamiento**: Vue Router 4
* **Backend y API REST**: Node.js, Express.js
* **Base de Datos y ODM**: MongoDB, Mongoose
* **Validaciones**: express-validator (Servidor), JS Vanilla (Cliente)
* **Estilizado Visual**: CSS Moderno con variables globales, Flexbox, CSS Grid y Glassmorphism

---

## 📦 Instalación y Puesta en Marcha (Entorno de Desarrollo)

Para ejecutar esta aplicación en tu entorno local, requieres tener **Node.js** y un servidor de **MongoDB** (por defecto en `mongodb://localhost:27017`) en ejecución.

### Paso 1: Configurar e Inicializar el Backend Express
1. Abre una terminal en el directorio raíz del proyecto.
2. Instala las dependencias del servidor:
   ```bash
   npm install
   ```
3. Verifica que el archivo `.env` en la raíz contiene:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/proyecto_final_db_v2
   SESSION_SECRET=tu_secreto_super_seguro
   ```
4. **Poblar la Base de Datos con Datos Iniciales (Semilla)**:
   Ejecuta el script de seeding para cargar las categorías y los 12 productos iniciales:
   ```bash
   npm run seed
   ```
   *Verás un mensaje en consola confirmando la creación exitosa en MongoDB.*
5. **Iniciar el Servidor Backend**:
   Ejecuta el servidor en modo desarrollo (con recarga automática):
   ```bash
   npm run dev
   ```
   *El backend estará escuchando en `http://localhost:3000`.*

### Paso 2: Configurar e Iniciar la SPA Frontend en Vue 3
1. Abre **una segunda terminal** y navega a la subcarpeta `frontend`:
   ```bash
   cd frontend
   ```
2. Instala las dependencias del cliente:
   ```bash
   npm install
   ```
3. **Iniciar el Servidor de Vite**:
   Ejecuta el entorno de desarrollo de Vite:
   ```bash
   npm run dev
   ```
   *El cliente Vue estará corriendo en `http://localhost:5173`.*

---

## 🌐 Cómo Navegar y Probar la Aplicación

1. Abre tu navegador web e ingresa a `http://localhost:5173`. *(Nota: Vite está configurado con un proxy interno para redirigir todas las llamadas `/api` hacia el puerto 3000 de forma transparente, eliminando problemas de CORS).*
2. **Iniciar Sesión**: Para acceder al inventario y a los controles administrativos, haz clic en el botón superior derecho **"🔑 Iniciar Sesión"**. El modal se abrirá con la cuenta de administrador pre-rellenada:
   * **Correo**: `admin@test.com`
   * **Contraseña**: `admin123`
3. **Explorar el Catálogo**:
   * Escribe en la barra de búsqueda superior para filtrar instantáneamente por nombre o descripción.
   * Selecciona una categoría del menú desplegable o cambia el filtro de niveles de stock en tiempo real.
4. **Añadir al Carrito**:
   * Haz clic en **"🛒 Añadir"** en cualquier producto. Verás aparecer una notificación flotante confirmando la adición.
   * Navega a la vista del carrito (`/cart`) para ajustar cantidades. Intenta incrementar la cantidad más allá del stock disponible para ver la validación en vivo.
5. **Crear y Editar Productos**:
   * Haz clic en **"➕ Nuevo Producto"** en el encabezado para abrir el formulario inteligente. Intenta enviar datos incompletos para observar el sistema de validación de Vue 3.
   * Haz clic en **"✏️ Editar"** en cualquier producto para modificar sus atributos.

---

## 📁 Estructura Completa de Directorios y Archivos

```text
/ (Raíz del Proyecto - Backend)
├── .env                       # Variables de configuración del entorno
├── app.js                     # Configuración principal de Express y middlewares
├── package.json               # Dependencias del backend y scripts (seed, dev)
├── seed.js                    # Script generador de productos y categorías iniciales
├── create_user.js             # Script auxiliar para generar usuarios administradores
├── /controllers               # Controladores REST (productController, categoryController, authController)
├── /models                    # Modelos Mongoose (Product, Category, User con virtuals)
├── /routes                    # Definición de rutas (productRoutes, categoryRoutes, authRoutes)
└── /uploads                   # Almacenamiento local de archivos e imágenes
    
/frontend (Subproyecto SPA Vue 3)
├── index.html                 # Punto de entrada HTML de la SPA
├── package.json               # Dependencias de Vue 3, Vue Router y Vite
├── vite.config.js             # Configuración de Vite (alias @ y proxy a puerto 3000)
├── jsconfig.json              # Configuración de resolución de módulos e IDE
├── /src
│   ├── main.js                # Instancia principal de la aplicación Vue y montaje
│   ├── App.vue                # Layout base, navegación superior, modal de login y <Suspense>
│   ├── /assets
│   │   └── main.css           # Sistema de diseño global premium (Glassmorphism, variables)
│   ├── /router
│   │   └── index.js           # Definición de rutas con Lazy Loading () => import(...)
│   ├── /composables
│   │   ├── useApi.js          # Gestor HTTP genérico (loading, error, reintentos, AbortController)
│   │   ├── useProducts.js     # Capa específica para el CRUD de productos
│   │   └── useCart.js         # Estado global del carrito y sincronización con localStorage
│   ├── /components
│   │   └── ProductCard.vue    # Componente modular y presentacional para tarjetas de catálogo
│   └── /views
│       ├── HomeView.vue       # Vista principal (Catálogo, filtros reactivos, búsqueda en vivo)
│       ├── ProductDetailView.vue # Vista de especificaciones detalladas por ID
│       ├── ProductFormView.vue   # Formulario inteligente para Alta (/new) y Edición (/edit)
│       ├── CartView.vue       # Carrito de compras funcional y cálculo de totales
│       ├── AboutView.vue      # Página descriptiva de arquitectura
│       └── NotFoundView.vue   # Manejador 404 para rutas inexistentes
```

---
*Desarrollado para la Tarea de Unidad 3 de Programación Web 2 (SPA en Vue 3 y REST APIs).*
