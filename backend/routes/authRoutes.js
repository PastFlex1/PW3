import express from "express";
import { mostrarLogin, procesarLogin, mostrarRegistro, procesarRegistro, logout, apiLogin, apiLogout } from "../controllers/authController.js";
import { validarLogin, validarRegistro } from "../middlewares/validation.js";
import { isNotAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Vistas web
router.get("/login", isNotAuthenticated, mostrarLogin);
router.post("/login", isNotAuthenticated, validarLogin, procesarLogin);
router.get("/register", isNotAuthenticated, mostrarRegistro);
router.post("/register", isNotAuthenticated, validarRegistro, procesarRegistro);
router.get("/logout", logout);

// Endpoints API REST para SPAs (Vue/React/etc)
router.post("/api/auth/login", validarLogin, apiLogin);
router.post("/api/auth/logout", apiLogout);
router.get("/api/auth/session", (req, res) => {
  if (req.session?.user) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.status(401).json({ authenticated: false, error: "No hay sesión activa" });
  }
});

export default router;