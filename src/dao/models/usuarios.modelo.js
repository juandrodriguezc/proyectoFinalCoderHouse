import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
      nombre: String,
      email: {
          type: String,
          unique: true,
          required: true
      },
      password: {
          type: String,
          required: true
      },
      lastLogin: Date,
      carrito: {
          type: mongoose.Types.ObjectId,
          ref: 'carritos'},
      rol: { 
          type: String, 
          enum: ["admin", "usuario"], 
          default: "usuario" 
      }
  },
  {
      timestamps: true
  }
);

// Exporta el modelo Usuario
export const usuariosModelo = mongoose.model("usuarios", usuarioSchema);
