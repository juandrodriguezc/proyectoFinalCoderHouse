import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productoSchema = new mongoose.Schema(
    {
        nombre: String,
        descripcion: String, 
        code: {
            type: String,
            unique: true,
            required:true
        },
        precio: Number,
        stock: Number
    },
    {
        timestamps: true
    }
);

productoSchema.plugin(paginate);

export const modeloProductos = mongoose.model("productos", productoSchema);
