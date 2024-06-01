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
    async getCartById(cartId) {
    return await modeloCarrito.findOne({ id: cartId });
    
    }

    // Agregar un producto al carrito
    async addProductToCart(cartId, productToAdd) {
        try {
            const cart = await modeloCarrito.findOne({ id: cartId });
            if (cart && productToAdd) {
                cart.productos.push(productToAdd);
                await cart.save();
                console.log(`Producto "${productToAdd.nombre}" agregado al carrito ${cartId}.`);
            } else {
                console.log(`Error: Carrito con ID ${cartId} o producto con ID ${productToAdd.id} no encontrado.`);
            }
        } catch (error) {
            console.error('Error al agregar un producto al carrito:', error);
            throw error;
        }
    }

    // Obtener todos los carritos
}

