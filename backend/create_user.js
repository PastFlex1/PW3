import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGODB_URI;

async function createUser() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Conectado a MongoDB");
    
    // Check if user exists
    const exists = await User.findOne({ email: "admin@test.com" });
    if (exists) {
      console.log("El usuario ya existe. Borrando usuario anterior...");
      await User.deleteOne({ email: "admin@test.com" });
    }

    const user = new User({
      username: "admin",
      email: "admin@test.com",
      password: "admin123"
    });
    await user.save();
    console.log("Usuario admin creado exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("Error creando usuario:", error);
    process.exit(1);
  }
}
createUser();
