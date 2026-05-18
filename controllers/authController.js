import User from "../models/User.js";
import bcrypt from "bcrypt";

export const mostrarLogin = (req, res) => {
  res.render("login", { errors: [], old: {}, user: null, useClientJS: false });
};

export const procesarLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.render("login", { errors: [{ msg: "Credenciales inválidas" }], old: req.body, user: null });
    }
    req.session.user = { id: user._id, username: user.username, email: user.email };
    res.redirect("/productos");
  } catch (error) {
    console.error(error);
    res.render("login", { errors: [{ msg: "Error interno" }], old: req.body, user: null });
  }
};

export const mostrarRegistro = (req, res) => {
  res.render("register", { errors: [], old: {}, user: null });
};

export const procesarRegistro = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email, password });
    await user.save();
    req.session.user = { id: user._id, username: user.username, email: user.email };
    
    // Renderizamos la misma vista pero con una bandera de éxito
    res.render("register", { success: true, username: user.username, errors: [], old: {}, user: null });
  } catch (error) {
    console.error("Error en registro:", error);
    if (error.code === 11000) {
      return res.render("register", { errors: [{ msg: "Usuario o email ya existe" }], old: req.body, user: null });
    }
    res.render("register", { errors: [{ msg: "Error al registrar" }], old: req.body, user: null });
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

export const apiLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }
    req.session.user = { id: user._id, username: user.username, email: user.email };
    res.json({ message: "Inicio de sesión exitoso", user: req.session.user });
  } catch (error) {
    console.error("Error en apiLogin:", error);
    res.status(500).json({ error: "Error interno del servidor en inicio de sesión" });
  }
};

export const apiLogout = (req, res) => {
  req.session.destroy();
  res.json({ message: "Sesión cerrada correctamente" });
};