import { body, validationResult } from "express-validator";

export const validarProducto = [
  body("nombre").trim().notEmpty().withMessage("El nombre del producto es obligatorio"),
  body("precio").isNumeric().withMessage("El precio debe ser un número").isFloat({ min: 0 }).withMessage("El precio no puede ser negativo"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
    next();
  }
];

export const validarProduct = [
  body("name").trim().notEmpty().withMessage("El nombre del producto es obligatorio"),
  body("price").isNumeric().withMessage("El precio debe ser un número").isFloat({ min: 0 }).withMessage("El precio no puede ser negativo"),
  body("stock").optional().isNumeric().withMessage("El stock debe ser un número entero").isInt({ min: 0 }).withMessage("El stock no puede ser negativo"),
  body("categoryId").notEmpty().withMessage("La categoría es obligatoria").isMongoId().withMessage("ID de categoría no válido"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
    next();
  }
];

export const validarRegistro = [
  body("username").trim().notEmpty().withMessage("El nombre de usuario es obligatorio").isLength({ min: 3 }).withMessage("El usuario debe tener al menos 3 caracteres"),
  body("email").isEmail().withMessage("Introduce un correo electrónico válido"),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("register", { errors: errors.array(), old: req.body, user: null });
    }
    next();
  }
];

export const validarLogin = [
  body("email").isEmail().withMessage("Correo electrónico no válido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("login", { errors: errors.array(), old: req.body, user: null });
    }
    next();
  }
];