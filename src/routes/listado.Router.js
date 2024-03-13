import { Router } from 'express';
import ProductManager from '../classes/productManager.js';
import { rutaProductos } from '../utils.js';


export const router=Router()

let productsManager=new ProductManager(rutaProductos)

router.get('/',(req,res)=>{
    let {nombre}=req.query
    res.status(200).render('inicio', {nombre})
})

router.get('/productos,', (req, res)=>{
    let productos=productsManager.getProduct()

    res.status(200).render('lista de productos')

})

export default router;