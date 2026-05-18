import express from "express";
import { upload } from "../middlewares/upload.js";
import { validarProduct } from "../middlewares/validation.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  renderProductsView,
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

// Vista web protegida
router.get("/productos", isAuthenticated, renderProductsView);

// Endpoints API RESTful protegidos
router.use("/api/products", isAuthenticated);
router.post("/api/products", upload.single("imageUrl"), validarProduct, createProduct);
router.get("/api/products", getProducts);
router.get("/api/products/:id", getProductById);
router.put("/api/products/:id", upload.single("imageUrl"), validarProduct, updateProduct);
router.patch("/api/products/:id", upload.single("imageUrl"), validarProduct, updateProduct);
router.delete("/api/products/:id", deleteProduct);

export default router;
