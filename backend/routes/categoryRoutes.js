import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { getCategories, createCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.use("/api/categories", isAuthenticated);
router.get("/api/categories", getCategories);
router.post("/api/categories", createCategory);

export default router;
