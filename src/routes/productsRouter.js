import { Router } from 'express';
import {ProductManager} from '../dao/productManagerDao.js';
import { authorizeAdmin, passportCall, rutaProductos } from '../utils.js';
import mongoose from 'mongoose';
import productosController from '../controller/productos.controller.js';
import passport from 'passport';

export const router=Router()

let productManager=new ProductManager(rutaProductos)

router.get('/', productosController.getProductos)

router.get('/:id', productosController.getProductosById)

router.post('/agregar', passportCall("current"), authorizeAdmin, productosController.crearProducto)

router.delete('/:id', productosController.eliminarProducto)


    export default router;
