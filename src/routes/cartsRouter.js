import { Router } from "express";
import CartManager from "../dao/cartManagerDao.js";
import { rutaCarrito } from "../utils.js";

export const cartsRouter = (productManager) => {
    const router = Router();
    const cartManager = new CartManager(rutaCarrito);

    router.get('/', async (req, res) => {
        const carts = await cartManager.getCarts();
        res.status(200).json(carts);
    });

    router.get('/:id', async (req, res) => { // Aquí la función debe ser async
        const cartId = parseInt(req.params.id);
        const cart = await cartManager.getCartById(cartId); // Esperar la función
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).send('Error 404. Carrito no encontrado');
        }
    });

    router.post('/', async (req, res) => {
        const newCart = await cartManager.createCart()
        res.status(201).json(newCart);
    });

    router.post('/:id/products/:productId', async (req, res) => {
        const cartId = parseInt(req.params.id);
        const productId = req.params.productId;

        const productToAdd = await productManager.getProductById(productId);

        if (productToAdd) {
            await cartManager.addProductToCart(cartId, productToAdd); // Esperar la función
            const cart = await cartManager.getCartById(cartId); // Esperar la función

            if (cart) {
                res.status(200).json(cart);
            } else {
                res.status(404).send('Error 404. Carrito no encontrado');
            }
        } else {
            res.status(404).send('Error 404. Producto no encontrado');
        }
    });

    return router;
}

export default cartsRouter;
