import { Router } from "express";
import carritoController from "../controller/carrito.controller.js";
import { passportCall, sendEmail } from "../utils.js";
import mongoose, { isValidObjectId } from "mongoose";
import {ProductManager as ProductDao} from "../dao/productManagerDao.js";
import { CartManager as CartDao } from "../dao/cartManagerDao.js";
import {TicketsDAO} from '../dao/ticketDao.js'

const carritosDAO=new CartDao()
const productosDAO=new ProductDao()
const ticketsDAO=new TicketsDAO()

    export const router = Router();

    // Obtener todos los carritos
    router.get('/', carritoController.getCarrito)

    // Obtener un carrito por su ID
    router.get('/:id', carritoController.getCarritoById)

    router.post('/', carritoController.createCarrito)

    // Agregar un producto a un carrito
    router.put('/:cid/producto/:pid', carritoController.getProductInCart);

    router.get("/comprar/:cid", passportCall('current'), carritoController.comprarCarrito);
