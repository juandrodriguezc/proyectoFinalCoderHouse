import { Router } from 'express';
import {ProductManager} from '../classes/productManager.js';
import { rutaProductos } from '../utils.js';

export const router=Router()

let productManager=new ProductManager(rutaProductos)

router.get('/', (req, res)=>{

    let productos=productManager.getProduct();

    res.status(200).json({productos})
})

    export default router;
