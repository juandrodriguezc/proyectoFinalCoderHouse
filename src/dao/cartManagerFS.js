// import fs from 'fs';
// import { rutaCarrito } from '../utils.js';

// class CartManager {
//     constructor(rutaCarrito) {
//         this.rutaCarrito = rutaCarrito;
//         this.carts = this.loadCartsFromFile();
//     }

//     //creando el carrito 
//     createCart() {
//         const cartId = this.carts.length + 1;
//         const newCart = { id: cartId, products: [] };
//         this.carts.push(newCart);
//         return newCart;
//     }
//     //obtener carrito con el id
//     getCartById(cartId) {
//         return this.carts.find(cart => cart.id === parseInt(cartId));
//     }
//     //agregar producto al carrito
//     addProductToCart(cartId, productToAdd) {
//         const cart = this.getCartById(cartId);

//         if (cart && productToAdd) {
//             cart.products.push(productToAdd);
//             this.saveCarts();
//             console.log(`Producto "${productToAdd.nombre}" agregado al carrito ${cartId}.`);
//         } else {
//             console.log(`Error: Carrito con ID ${cartId} o producto con ID ${productToAdd.id} no encontrado.`);
//         }
//     }
//     //obtener los carritos
//     getCarts() {
//         return this.carts;
//     }

//     loadCartsFromFile() {
//         try {
//             const data = fs.readFileSync(this.rutaCarrito, 'utf8');
//             console.log('Carritos cargados correctamente desde el file.');
//             return JSON.parse(data);
//         } catch (err) {
//             console.error('Error al cargar los carts desde el archivo:', err);
//             return [];
//         }
//     }

//     saveCarts(){
//         fs.writeFileSync(this.rutaCarrito, JSON.stringify(this.carts, null, 2));
//     }


// }

// export default CartManager;