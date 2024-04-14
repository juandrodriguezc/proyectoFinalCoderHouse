import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productosSchema = new mongoose.Schema({
    name: String,
    precio: Number
});

productosSchema.plugin(paginate);

export const modeloProductos = mongoose.model('productos', productosSchema);