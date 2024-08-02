import mongoose from 'mongoose';
import { modeloCarrito } from '../dao/models/carrito.modelo.js';

export class CartManager {
    constructor() {
    }
    
    async getCarts() {
       return await modeloCarrito.find().lean()
    }

    // Crear un nuevo carrito
    async createCart() {
            const cartsCount = await modeloCarrito.countDocuments();
        return await modeloCarrito.create({ id: cartsCount + 1, products: [] });
    }

 // Obtener un carrito por su ID
async getCartById(filtro) {
    console.log('Filtro recibido:', filtro);
    console.log('ID del filtro:', filtro._id);
    console.log('Tipo de filtro._id:', typeof filtro._id);

    try {
        if (!mongoose.Types.ObjectId.isValid(filtro._id)) {
            throw new Error('ID inválido');
        }

        // Usa mongoose.Types.ObjectId para convertir el ID
        const objectId = new mongoose.Types.ObjectId(filtro._id);
        return await modeloCarrito.findOne({ _id: objectId }).lean();
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        throw error;
    }
}

    // Agregar un producto al carrito
    async addProductToCart(cartId, productToAdd) {
        try {
            const objectId = new mongoose.Types.ObjectId(cartId); // Usa mongoose.Types.ObjectId
            const cart = await modeloCarrito.findOne({ _id: objectId });
    
            if (cart && productToAdd) {
                cart.productos.push(productToAdd);
                await cart.save();
                console.log(`Producto "${productToAdd.nombre}" agregado al carrito ${cartId}.`);
                return cart; // Devuelve el carrito actualizado
            } else {
                console.log(`Error: Carrito con ID ${cartId} o producto no encontrado.`);
                return null; // Devuelve null si el carrito no se encuentra
            }
        } catch (error) {
            console.error('Error al agregar un producto al carrito:', error);
            throw error;
        }
    }

async update(id, carrito){
        return await modeloCarrito.updateOne({_id:id}, carrito)
    }
}

