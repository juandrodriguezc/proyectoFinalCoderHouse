import mongoose from "mongoose"

const productosColl="productos"
const productosSchema=new mongoose.Schema(
    {
        nombre: {type:String, required:true},
        precio: {type:Number, required:true},
    },
    {
        timestamps: true, strict:false
    }
)

export const modeloProductos=mongoose.model(productosColl, productosSchema)