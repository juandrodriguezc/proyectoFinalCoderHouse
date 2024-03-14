import { Router } from 'express';
import ProductManager from '../classes/productManager.js';
import { rutaProductos } from '../utils.js';


export const router=Router()

let productsManager=new ProductManager(rutaProductos)

router.get('/',(req,res)=>{
    let {nombre}=req.query
    res.status(200).render('inicio', {nombre})
})

router.get('/productos', async (req, res)=>{
    let productos= await productsManager.getProduct()

    res.status(200).render('productos', {productos})

})

router.get('/realtimesproduct', async(req, res)=>{
    let productosTime= await productsManager.getProduct()
    res.status(200).render('realTimesProducts', {productosTime})

})

export default router;