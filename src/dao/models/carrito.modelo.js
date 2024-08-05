import mongoose from "mongoose";

const carritoSchema = new mongoose.Schema(
    {
        productos: [
            {
                producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto" }, // Debe coincidir con el nombre del modelo
                cantidad: Number
            }
        ]
    },
    {
        timestamps: true
    }
);

export const modeloCarrito = mongoose.model("Carrito", carritoSchema);