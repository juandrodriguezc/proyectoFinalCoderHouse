import mongoose from "mongoose"

const carritosColl="mascotas"
const carritosEsquema=new mongoose.Schema(
    {
        nombre: {type:String, required:true}
    },
    {
        timestamps:true
    }
)

export const carritosModelo=mongoose.model(carritosColl, carritosEsquema)