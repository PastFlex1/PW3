import Product from "../models/Product.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

export const renderProductsView = (req, res) => {
  res.render("productos", {
    user: req.session.user,
    useClientJS: true
  });
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, stock, categoryId } = req.body;
    let imageUrl = "";
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }
    
    const newProduct = new Product({
      name,
      price: Number(price),
      description: description || "",
      imageUrl,
      categoryId,
      stock: stock ? Number(stock) : 0
    });
    
    await newProduct.save();
    const populatedProduct = await Product.findById(newProduct._id).populate("categoryId");
    req.io.emit("producto_creado", populatedProduct);
    res.status(201).json(populatedProduct);
  } catch (error) {
    console.error("Error en createProduct:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: Object.values(error.errors).map(e => e.message).join(", ") });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Tipo de dato incorrecto en uno de los campos enviados" });
    }
    res.status(500).json({ error: "Error interno al crear el producto" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("categoryId").sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Error en getProducts:", error);
    res.status(500).json({ error: "Error interno al obtener los productos" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "El ID del producto proporcionado no tiene un formato válido" });
    }
    
    const product = await Product.findById(id).populate("categoryId");
    if (!product) return res.status(404).json({ error: "Producto no encontrado en el inventario" });
    res.json(product);
  } catch (error) {
    console.error("Error en getProductById:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Formato de ID inválido" });
    }
    res.status(500).json({ error: "Error interno al obtener el producto" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "El ID del producto proporcionado no tiene un formato válido" });
    }
    
    const product = await Product.findById(id);
    if (!product) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "Producto no encontrado en el inventario para actualizar" });
    }
    
    const { name, price, description, stock, categoryId } = req.body;
    if (name) product.name = name.trim();
    if (price !== undefined) product.price = Number(price);
    if (description !== undefined) product.description = description;
    if (stock !== undefined) product.stock = Number(stock);
    if (categoryId) product.categoryId = categoryId;
    
    if (req.file) {
      if (product.imageUrl && product.imageUrl.startsWith("/uploads/")) {
        const oldPath = path.join(process.cwd(), product.imageUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      product.imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl !== undefined) {
      product.imageUrl = req.body.imageUrl;
    }
    
    await product.save();
    const populatedProduct = await Product.findById(product._id).populate("categoryId");
    req.io.emit("producto_actualizado", populatedProduct);
    res.json(populatedProduct);
  } catch (error) {
    console.error("Error en updateProduct:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: Object.values(error.errors).map(e => e.message).join(", ") });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Tipo de dato incorrecto en la solicitud" });
    }
    res.status(500).json({ error: "Error interno al actualizar el producto" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "El ID del producto proporcionado no tiene un formato válido" });
    }
    
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado para eliminar" });
    
    if (product.imageUrl && product.imageUrl.startsWith("/uploads/")) {
      const imagePath = path.join(process.cwd(), product.imageUrl);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
    
    await Product.findByIdAndDelete(id);
    req.io.emit("producto_eliminado", { id });
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error en deleteProduct:", error);
    res.status(500).json({ error: "Error interno al eliminar el producto" });
  }
};
