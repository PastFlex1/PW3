import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";
import Product from "./models/Product.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/proyecto_final_db_v2";

async function seedDatabase() {
  try {
    console.log("Conectando a la base de datos en:", MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado exitosamente a MongoDB.");

    console.log("🧹 Limpiando colecciones anteriores de Category y Product...");
    await Product.deleteMany({});
    await Category.deleteMany({});

    console.log("🌱 Insertando 5 categorías de prueba...");
    const categoriesData = [
      { name: "Electrónica y Tecnología" },
      { name: "Ropa y Calzado" },
      { name: "Hogar y Decoración" },
      { name: "Deportes y Aire Libre" },
      { name: "Libros y Educación" }
    ];

    const insertedCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    insertedCategories.forEach(cat => {
      catMap[cat.name] = cat._id;
    });

    console.log("📦 Insertando 12 productos de alta calidad...");
    const productsData = [
      // Electrónica
      {
        name: "Smartphone Pro Max Ultra",
        price: 1199.99,
        description: "Teléfono inteligente de última generación con pantalla OLED de 6.7 pulgadas, cámara triple de 108MP y batería para todo el día.",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
        categoryId: catMap["Electrónica y Tecnología"],
        stock: 25
      },
      {
        name: "Laptop Creator Pro 16\"",
        price: 1899.50,
        description: "Potente computadora portátil para profesionales y creadores de contenido. 32GB de RAM, SSD NVMe de 2TB y tarjeta gráfica dedicada.",
        imageUrl: "https://images.unsplash.com/photo-1496181130384-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
        categoryId: catMap["Electrónica y Tecnología"],
        stock: 12
      },
      {
        name: "Auriculares Noise Cancelling Studio",
        price: 299.00,
        description: "Auriculares inalámbricos de diadema con cancelación activa de ruido premium y audio espacial de alta fidelidad.",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        categoryId: catMap["Electrónica y Tecnología"],
        stock: 45
      },
      {
        name: "Reloj Inteligente Ultra Sport",
        price: 349.99,
        description: "Smartwatch resistente al agua con GPS integrado, sensor de oxígeno en sangre y más de 50 modos de entrenamiento.",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
        categoryId: catMap["Electrónica y Tecnología"],
        stock: 3
      },

      // Ropa
      {
        name: "Chaqueta de Cuero Vintage",
        price: 189.90,
        description: "Chaqueta de cuero genuino estilo motero con acabados artesanales y forro térmico interior.",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
        categoryId: catMap["Ropa y Calzado"],
        stock: 8
      },
      {
        name: "Zapatillas Running Cloud Speed",
        price: 129.99,
        description: "Calzado deportivo ultraligero con suela de amortiguación avanzada para corredores de asfalto y pista.",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
        categoryId: catMap["Ropa y Calzado"],
        stock: 30
      },
      {
        name: "Mochila Urbana Impermeable",
        price: 79.50,
        description: "Mochila ergonómica de 25L con compartimento acolchado para laptop de hasta 17 pulgadas y puerto USB de carga.",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
        categoryId: catMap["Ropa y Calzado"],
        stock: 18
      },

      // Hogar
      {
        name: "Lámpara Minimalista de Escritorio",
        price: 45.00,
        description: "Lámpara LED con control táctil de intensidad y temperatura de color ajustable para cuidar la vista.",
        imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f7821?w=600&auto=format&fit=crop&q=80",
        categoryId: catMap["Hogar y Decoración"],
        stock: 50
      },
      {
        name: "Silla Ergonómica Executive",
        price: 249.99,
        description: "Silla de oficina con soporte lumbar ajustable, malla transpirable y reposacabezas reclinable 3D.",
        imageUrl: "https://images.unsplash.com/photo-1580481077494-e3299ac52ee6?w=600&auto=format&fit=crop&q=80",
        categoryId: catMap["Hogar y Decoración"],
        stock: 15
      },

      // Deportes
      {
        name: "Balón de Fútbol Profesional",
        price: 39.99,
        description: "Balón oficial termo-sellado sin costuras para un control perfecto y resistencia en cualquier terreno.",
        imageUrl: "https://images.unsplash.com/photo-1614632537190-23e4146777db?w=600&auto=format&fit=crop&q=80",
        categoryId: catMap["Deportes y Aire Libre"],
        stock: 40
      },
      {
        name: "Botella Térmica Inox 1L",
        price: 24.90,
        description: "Botella de acero inoxidable de doble pared que mantiene las bebidas frías por 24 horas y calientes por 12 horas.",
        imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
        categoryId: catMap["Deportes y Aire Libre"],
        stock: 100
      },

      // Libros
      {
        name: "Libro: Arquitectura Limpia en Node.js",
        price: 49.99,
        description: "Guía completa para diseñar APIs escalables, robustas y de alto rendimiento utilizando patrones de diseño modernos.",
        imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80",
        categoryId: catMap["Libros y Educación"],
        stock: 0 // Para probar la visualización de "Agotado"
      }
    ];

    await Product.insertMany(productsData);
    console.log("========================================");
    console.log("🎉 BASE DE DATOS POBLADA EXITOSAMENTE 🎉");
    console.log(`✅ Categorías creadas: ${insertedCategories.length}`);
    console.log(`✅ Productos creados: ${productsData.length}`);
    console.log("========================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error al poblar la base de datos:", error);
    process.exit(1);
  }
}

seedDatabase();
