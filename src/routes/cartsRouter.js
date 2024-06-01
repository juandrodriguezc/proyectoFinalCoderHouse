import { Router } from "express";
import carritoController from "../controller/carrito.controller.js";

    export const router = Router();

    // Obtener todos los carritos
    router.get('/', carritoController.getCarrito)

    // Obtener un carrito por su ID
    router.get('/:id', carritoController.getCarritoById)

    // Crear un nuevo carrito
    router.post('/', carritoController.createCarrito)

    // Agregar un producto a un carrito
    router.post('/:id/productos/:productId', carritoController.getProductInCart);
