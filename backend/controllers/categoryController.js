import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    let categories = await Category.find().sort({ name: 1 });
    
    // Autoseeding si no hay categorías en la base de datos
    if (categories.length === 0) {
      const defaultCategories = [
        { name: "Electrónica" },
        { name: "Ropa y Calzado" },
        { name: "Hogar y Muebles" },
        { name: "Alimentos y Bebidas" },
        { name: "Juguetes y Juegos" },
        { name: "Otros" }
      ];
      await Category.insertMany(defaultCategories);
      categories = await Category.find().sort({ name: 1 });
    }
    
    res.json(categories);
  } catch (error) {
    console.error("Error en getCategories:", error);
    res.status(500).json({ error: "Error al obtener las categorías" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "El nombre de la categoría es obligatorio" });
    }
    
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ error: "La categoría ya existe" });
    }
    
    const newCategory = new Category({ name: name.trim() });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error en createCategory:", error);
    res.status(500).json({ error: "Error al crear la categoría" });
  }
};
