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
          ref: 'Carrito'},
      rol: { 
          type: String, 
          enum: ["Admin", "Usuario"], 
          default: "Usuario" 
      }
  },
  {
      timestamps: true
  }
);

// Exporta el modelo Usuario
export const usuariosModelo = mongoose.model("Usuario", usuarioSchema);
