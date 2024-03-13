import ProductManager from "./productManager.js";
class CartManager {
    constructor() {
        this.carts = [];
    }
    //creando el carrito 
    createCart() {
        const cartId = this.carts.length + 1;
        const newCart = { id: cartId, products: [] };
        this.carts.push(newCart);
        return newCart;
    }
    //obtener carrito con el id
    getCartById(cartId) {
        return this.carts.find(cart => cart.id === cartId);
    }
    //agregar producto al carrito
    addProductToCart(cartId, productId, productManager) {
        const cart = this.getCartById(cartId);
        const product = productManager.getProductById(productId); // Obtener el producto por su ID

        if (cart && product) {
            cart.products.push(product);
            console.log(`Producto "${product.nombre}" agregado al carrito ${cartId}.`);
        } else {
            console.log(`Error: Carrito con ID ${cartId} o producto con ID ${productId} no encontrado.`);
        }
    }
    //obtener los carritos
    getCarts() {
        return this.carts;
    }

    // addProductToCart(cartId, product) {
    //     const cart = this.getCartById(cartId);
    //     if (cart) {
    //         cart.products.push(product);
    //         console.log(`Producto "${product.nombre}" agregado al carrito ${cartId}.`);
    //     } else {
    //         console.log(`Error: Carrito con ID ${cartId} no encontrado.`);
    //     }
    // }
}

export default CartManager;