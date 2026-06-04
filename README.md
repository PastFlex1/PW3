# 📦 MiInventarioExpress - Proyecto Final (SPA Full-Stack)

MiInventarioExpress es una **Single Page Application (SPA)** completa y moderna, construida utilizando el stack **MEVN (MongoDB, Express, Vue 3 y Node.js)**. 

Este proyecto demuestra la implementación de una arquitectura distribuida profesional, donde el **Frontend** (cliente) y el **Backend** (API) están completamente desacoplados y alojados en infraestructuras diferentes en la nube, comunicándose de forma segura a través de Internet.

---

## 🚀 Enlaces de Despliegue en Producción

El proyecto está completamente funcional y desplegado en los siguientes servicios en la nube:

* 🌐 **Frontend (SPA en Netlify):** [https://pw4.netlify.app](https://pw4.netlify.app)
* ⚙️ **Backend (API en Railway):** [https://pw3-production.up.railway.app](https://pw3-production.up.railway.app)
* 📚 **Micrositio de Documentación (GitHub Pages):** [https://pastflex1.github.io/PW3/](https://pastflex1.github.io/PW3/)

> **Credenciales de Acceso:**
> * **Usuario:** `admin@test.com`
> * **Contraseña:** `admin123`

---

## 🏗️ Arquitectura de Despliegue

La aplicación sigue una arquitectura moderna dividida en tres capas principales separadas y desplegadas de forma independiente:

1. **Capa de Presentación (Frontend):** 
   - Desarrollada con **Vue 3**, **Vite** y **Vue Router**.
   - Desplegada en **Netlify** con integración continua (CI/CD) desde GitHub. 
   - Utiliza una regla de redirección estática (`_redirects`) para delegar el enrutamiento al lado del cliente (Vue Router).
2. **Capa Lógica (Backend):** 
   - Desarrollada con **Node.js** y **Express**.
   - Alojada en **Railway** usando contenedores detectados automáticamente vía Nixpacks.
   - Implementa políticas CORS estrictas restringidas al dominio de Netlify y cookies seguras (`SameSite: None`, `Secure`) para gestionar la sesión entre distintos dominios.
3. **Capa de Datos (Base de Datos):** 
   - Utiliza **MongoDB Atlas** (clúster en la nube gestionado).
   - Se configuró el acceso global por IP Allowlist (`0.0.0.0/0`) para permitir conexiones dinámicas desde los contenedores de Railway mediante TLS/SSL obligatorio.

---

## 🛠️ Tecnologías Utilizadas

* **Motor de Frontend:** Vue 3 (SFC, Script Setup, Composition API)
* **Empaquetador y Servidor:** Vite
* **Enrutamiento:** Vue Router 4 (implementando *Lazy Loading*)
* **Backend y API REST:** Node.js, Express.js
* **Base de Datos y ODM:** MongoDB Atlas, Mongoose
* **Gestor de Sesiones:** express-session
* **Validaciones:** express-validator (Servidor), JS Vanilla (Cliente)
* **Estilizado Visual:** CSS Moderno con variables globales, Flexbox, CSS Grid y efectos visuales de cristal (Glassmorphism).

---

## 📦 Instalación y Ejecución Local

Si deseas correr este proyecto en tu propio computador para desarrollo o pruebas:

### Requisitos Previos
* Node.js v16 o superior.
* MongoDB instalado localmente o una URI válida de MongoDB Atlas.

### Pasos de Instalación
1. Abre una terminal en el directorio raíz del proyecto (donde está este archivo `README.md`).
2. Instala todas las dependencias (raíz, backend y frontend) con el comando preparado en el monorepo:
   ```bash
   npm run install:all
   ```
3. Configura tus variables de entorno locales:
   - En la raíz, copia el archivo de ejemplo para crear el tuyo propio:
     ```bash
     cp .env.example .env
     ```
   - Si es necesario, ajusta en el `.env` recién creado la cadena de conexión de MongoDB (`MONGODB_URI`).
4. **Poblar la Base de Datos (Seeding):**
   Entra a la carpeta del backend y genera los datos de prueba y el usuario administrador:
   ```bash
   cd backend
   npm run seed
   node create_user.js
   cd ..
   ```
5. **Iniciar los Servidores en Desarrollo:**
   Ejecuta el servidor backend y el frontend de Vite de manera concurrente desde la raíz:
   ```bash
   npm run dev
   ```
   *El backend estará escuchando en `http://localhost:3000` y el cliente web en `http://localhost:5173`.*

---

## 📁 Estructura del Monorepo

```text
/ (Raíz del Proyecto)
├── package.json               # Orquestación del monorepo (scripts concurrentes)
├── .env.example               # Variables de entorno globales de ejemplo
├── netlify.toml               # Configuración de despliegue para Netlify
├── /docs                      # Micrositio para despliegue en GitHub Pages
│
├── /backend (API Express)
│   ├── app.js                 # Servidor, Middlewares, CORS y Sesiones
│   ├── seed.js                # Poblador de categorías y productos
│   ├── create_user.js         # Script para generar el usuario administrador
│   ├── /controllers           # Controladores de la API REST
│   ├── /models                # Esquemas y modelos Mongoose
│   ├── /routes                # Rutas Express (protegidas y públicas)
│   └── /middlewares           # Autenticación y Subida de imágenes (Multer)
│
└── /frontend (SPA Vue 3)
    ├── /public/_redirects     # Regla de redirección SPA obligatoria para Netlify
    ├── .env.production        # Apunta a la URL de producción de Railway
    ├── vite.config.js         # Configuración del servidor de desarrollo Vite
    ├── /src/router            # Rutas del cliente (Vue Router)
    ├── /src/composables       # Lógica reutilizable y Fetch API avanzada (useApi)
    ├── /src/views             # Vistas de la aplicación (Catálogo, Carrito, etc.)
    └── /src/components        # Componentes UI reutilizables
```

---
*Desarrollado como Proyecto Final (SPA en Vue 3 y REST APIs).*
