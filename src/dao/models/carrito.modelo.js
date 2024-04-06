import mongoose from 'mongoose';

const carritoSchema = new mongoose.Schema({
    id: Number,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producto' }]
});

export const modeloCarrito = mongoose.model('Carrito', carritoSchema);