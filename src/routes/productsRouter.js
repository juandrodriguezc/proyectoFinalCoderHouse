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
// async (req, res) => {
//     let { id } = req.params
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         res.setHeader('Content-Type', 'application/json');
//         return res.status(400).json({ error: `Id inválido` })
//     }

//     let aModificar = req.body
//     if (aModificar._id) {
//         delete aModificar._id
//     }

//     try {
//         let resultado = await productManager.update(id, aModificar)
//         if (resultado.modifiedCount > 0) {
//             res.status(200).json({
//                 message: `Producto actualizado correctamente`
//             })
//         } else {
//             res.setHeader('Content-Type', 'application/json');
//             return res.status(400).json({ error: `No existe el producto con id ${id}` })
//         }
//     } catch (error) {
//         res.setHeader('Content-Type', 'application/json');
//         return res.status(500).json(
//             {
//                 error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
//                 detalle: `${error.message}`
//             }
//         )
//     }
// })





    export default router;
