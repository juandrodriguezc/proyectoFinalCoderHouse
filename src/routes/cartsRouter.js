import { Router } from "express";
import { modeloCarrito } from "../dao/models/carrito.modelo.js";
import { modeloProductos } from "../dao/models/producto.modelo.js";

    export const router = Router();

    // Obtener todos los carritos
    router.get('/', async (req, res) => {
        try {
            const carts = await modeloCarrito.find().lean();
            res.status(200).render('carts', {carts});
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
            res.status(500).send('Error al obtener los carritos');
        }
    });

    // Obtener un carrito por su ID
    router.get('/:id', async (req, res) => {
        const cartId = req.params.id;
        try {
            const cart = await modeloCarrito.findById(cartId);
            if (cart) {
                res.json(cart);
            } else {
                res.status(404).send('Error 404. Carrito no encontrado');
            }
        } catch (error) {
            console.error('Error al obtener el carrito por ID:', error);
            res.status(500).send('Error al obtener el carrito por ID');
        }
    });

    // Crear un nuevo carrito
    router.post('/', async (req, res) => {
        try {
            const newCart = await modeloCarrito.create({});
            res.status(201).json(newCart);
        } catch (error) {
            console.error('Error al crear un nuevo carrito:', error);
            res.status(500).send('Error al crear un nuevo carrito');
        }
    });

    // Agregar un producto a un carrito
    router.post('/:id/products/:productId', async (req, res) => {
        const { id: cartId, productId } = req.params;
        try {
            const productToAdd = await modeloProductos.findById(productId);
            if (productToAdd) {
                const cart = await modeloCarrito.findById(cartId);
                if (cart) {
                    cart.products.push(productToAdd);
                    await cart.save();
                    res.status(200).json(cart);
                } else {
                    res.status(404).send('Error 404. Carrito no encontrado');
                }
            } else {
                res.status(404).send('Error 404. Producto no encontrado');
            }
        } catch (error) {
            console.error('Error al agregar un producto al carrito:', error);
            res.status(500).send('Error al agregar un producto al carrito');
        }
    });
