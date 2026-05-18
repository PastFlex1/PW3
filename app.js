import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";

import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import Mensaje from "./models/Mensaje.js";
import multer from "multer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = createServer(app);
const io = new Server(server);

// ========== CONFIGURACIÓN HANDLEBARS ==========
app.engine("hbs", engine({ extname: ".hbs", defaultLayout: "main" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
// =============================================

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configuración de Sesiones (compartida con Socket.io)
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "secreto_default",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hora
});

app.use(sessionMiddleware);

// Inyectar io en cada request (para emitir eventos desde controladores)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ========== RUTAS ==========

// Redirección raíz (Prioridad)
app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/productos");
  } else {
    res.redirect("/login");
  }
});

app.use("/", authRoutes);
app.use("/", productRoutes);
app.use("/", categoryRoutes);
app.use("/", chatRoutes);

// ========== SOCKET.IO (chat y productos) ==========
io.use((socket, next) => {
  // Log para ver si llegan cookies
  console.log("Cookies recibidas en handshake:", socket.request.headers.cookie);
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");

  // Recuperar sesión de la petición
  const session = socket.request.session;
  let username = "Anónimo";

  if (session && session.user) {
    username = session.user.username;
    console.log(`Usuario identificado en chat: ${username}`);
  } else {
    console.log("No se encontró sesión de usuario. Contenido de session:", session);
  }

  // Enviar historial inicial
  try {
    const mensajes = await Mensaje.find().sort({ fecha: 1 }).limit(50);
    socket.emit("historial", mensajes);
  } catch (err) {
    console.error("Error al cargar historial:", err);
  }

  // Manejar mensajes nuevos
  socket.on("chat message", async (data) => {
    try {
      if (!data.mensaje || data.mensaje.trim() === "") return;
      
      const nuevo = new Mensaje({ 
        usuario: username, 
        mensaje: data.mensaje 
      });
      await nuevo.save();
      
      io.emit("chat message", { 
        usuario: username, 
        mensaje: data.mensaje, 
        fecha: nuevo.fecha 
      });
    } catch (err) {
      console.error("Error al guardar mensaje:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${username}`);
  });
});
// ===============================================

// Middleware de error 404
app.use((req, res) => {
  if (req.originalUrl.startsWith("/api/")) {
    return res.status(404).json({ error: "Endpoint de la API no encontrado (404)" });
  }
  res.status(404).send("Página no encontrada");
});

// Manejo de errores de Multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "La imagen es demasiado grande. Máximo 2MB." });
    }
    return res.status(400).json({ error: err.message });
  } else if (err.message === "Solo imágenes") {
    return res.status(400).json({ error: "Formato no permitido. Solo imágenes (jpg, png, webp, etc)." });
  }
  next(err);
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Conexión a MongoDB y arranque
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    server.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("Error conectando a MongoDB:", err);
    process.exit(1);
  });