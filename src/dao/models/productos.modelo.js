import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

// Define el esquema de producto
const productoSchema = new mongoose.Schema(
    {
        nombre: String,
        descripcion: String, 
        codigo: {
            type: String,
            unique: true
        },
        precio: Number,
        stock: Number
    },
    {
        timestamps: true
    }
);

// Agregar plugin de paginación (opcional, si lo usas)
productoSchema.plugin(paginate);

// Crear y exportar el modelo
export const modeloProductos = mongoose.model("Producto", productoSchema);
