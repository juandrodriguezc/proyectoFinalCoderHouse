import { isValidObjectId } from "mongoose";
import { CartManager as CartDao } from "../dao/cartManagerDao.js";
import { ProductManager as ProductDao } from "../dao/productManagerDao.js";

const productDao=new ProductDao()
const cartDao=new CartDao()

export default class carritoController{

    static getCarrito=async (req, res) => {
        try {
            const carts = await cartDao.getCarts();
            res.status(200).render('carts', {carts});
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
            res.status(500).send('Error al obtener los carritos');
        }
    }

    static createCarrito=async (req, res) => {
        try {
            const newCart = await cartDao.createCart({});
            res.status(201).json(newCart);
        } catch (error) {
            console.error('Error al crear un nuevo carrito:', error);
            res.status(500).send('Error al crear un nuevo carrito');
        }
    }

    static getCarritoById=async (req, res) => {
        const cartId = req.params.id;
        try {
            const cart = await cartDao.getCartById(cartId);
            if (cart) {
                res.json(cart);
            } else {
                res.status(404).send('Error 404. Carrito no encontrado');
            }
        } catch (error) {
            console.error('Error al obtener el carrito por ID:', error);
            res.status(500).send('Error al obtener el carrito por ID');
        }
    }

    static getProductInCart = async (req, res) => {
        const { id: cartId, productId } = req.params;
        if (!isValidObjectId(productId) || !isValidObjectId(cartId)) {
            return res.status(400).send('Error: ID de producto o carrito no válido');
        }


        try {
            const productToAdd = await productDao.getProductById({ _id: productId });
            if (!productToAdd) {
                return res.status(404).send('Error 404. Producto no encontrado');
            }

            const updatedCart = await cartDao.addProductToCart(cartId, productToAdd);
            if (!updatedCart) {
                return res.status(404).send('Error 404. Carrito no encontrado');
            }

            res.status(200).json(updatedCart);
        } catch (error) {
            console.error('Error al agregar un producto al carrito:', error);
            res.status(500).send('Error al agregar un producto al carrito');
        }
    }
    }
