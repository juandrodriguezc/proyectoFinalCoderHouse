import mongoose from "mongoose";

const carritoSchema = new mongoose.Schema(
    {
        productos: [
            {
                producto: { type: mongoose.Types.ObjectId, ref: "productos" }, // Debe coincidir con el nombre del modelo
                cantidad: Number
            }
        ]
    },
    {
        timestamps: true
    }
);

export const modeloCarrito = mongoose.model("carritos", carritoSchema);