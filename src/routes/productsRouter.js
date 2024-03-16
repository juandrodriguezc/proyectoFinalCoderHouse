import { Router } from 'express';
import {ProductManager} from '../classes/productManager.js';
import { rutaProductos } from '../utils.js';

export const router=Router()

let productManager=new ProductManager(rutaProductos)

router.post('/',async(req,res)=>{

    const {nombre, precio}=req.body
    console.log('Nombre del producto recibido:', nombre)
    if(!nombre || !precio){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Complete los datos del producto`})
    }

    let nuevoProducto=await productManager.addProduct(nombre, precio);   
    if(!nuevoProducto){
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`})
    }
    req.io.emit("nuevoProducto", nuevoProducto)

    res.setHeader('Content-Type','application/json')
    res.status(201).json({nuevoProducto})
})
    export default router;
