import { Router } from 'express';
import {ProductManager} from '../dao/productManagerDao.js';
import { rutaProductos } from '../utils.js';
import mongoose from 'mongoose';
import productosController from '../controller/productos.controller.js';

export const router=Router()

let productManager=new ProductManager(rutaProductos)

router.get('/', productosController.getProductos)

router.post('/',productosController.crearProducto)

router.get('/:id', productosController.getProductosById)

router.delete('/:id', productosController.eliminarProducto)


    export default router;
