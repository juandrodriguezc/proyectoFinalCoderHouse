import { modeloCarrito } from '../dao/models/carrito.modelo.js';

class CartManager {
    constructor(rutaCarrito) {
    }

    // Crear un nuevo carrito
    async createCart() {
        try {
            const cartsCount = await modeloCarrito.countDocuments();
            const newCart = await modeloCarrito.create({ id: cartsCount + 1, products: [] });
            console.log('Carrito creado:', newCart);
            return newCart;
        } catch (error) {
            console.error('Error al crear un nuevo carrito:', error);
            throw error;
        }
    }

    // Obtener un carrito por su ID
    async getCartById(cartId) {
        try {
            const cart = await modeloCarrito.findOne({ id: cartId });
            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito por ID:', error);
            throw error;
        }
    }

    // Agregar un producto al carrito
    async addProductToCart(cartId, productToAdd) {
        try {
            const cart = await modeloCarrito.findOne({ id: cartId });
            if (cart && productToAdd) {
                cart.products.push(productToAdd);
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
    async getCarts() {
        try {
            const carts = await modeloCarrito.find();
            return carts;
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
            throw error;
        }
    }
}

export default CartManager;