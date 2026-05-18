import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

async function createUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB...");

    const username = "admin";
    const email = "admin@test.com";
    const password = "admin123";

    // Borrar si ya existe para asegurar que funcione
    await User.deleteOne({ email });
    await User.deleteOne({ username });

    const user = new User({ username, email, password });
    await user.save();

    console.log("========================================");
    console.log("USUARIO CREADO EXITOSAMENTE");
    console.log(`Usuario: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("========================================");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

createUser();
