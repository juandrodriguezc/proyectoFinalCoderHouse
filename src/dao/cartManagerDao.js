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
        // Verificar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(filtro._id)) {
            throw new Error('ID inválido');
        }

        // Convertir el ID a ObjectId
        const objectId = new mongoose.Types.ObjectId(filtro._id);
        return await modeloCarrito.findOne({ _id: objectId }).lean();
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        throw error;
    }
}

async getOneByPopulate(filtro={}){
    return await modeloCarrito.findOne(filtro).populate("productos.producto").lean()
}


    // Agregar un producto al carrito
    async addProductToCart(cartId, productToAdd, cantidad) {
        try {
            const objectId = new mongoose.Types.ObjectId(cartId); 
            const cart = await modeloCarrito.findOne({ _id: objectId });
            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado`);
            }
            if (!productToAdd) {
                throw new Error('Producto a agregar no encontrado');
            }
    
            const existingProductIndex = cart.productos.findIndex(p => p.producto.equals(productToAdd._id));
            if (existingProductIndex > -1) {
                cart.productos[existingProductIndex].cantidad += cantidad;
            } else {
                cart.productos.push({ producto: productToAdd._id, cantidad });
            }
    
            await cart.save();
            console.log("Producto agregado", productToAdd);
            return cart; 
        } catch (error) {
            console.error('Error al agregar un producto al carrito:', error);
            throw error;
        }
    }
    

async update(id, carrito){
        return await modeloCarrito.updateOne({_id:id}, carrito)
    }
}

