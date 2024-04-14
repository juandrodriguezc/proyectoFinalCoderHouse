import { Router } from 'express';
import {ProductManager} from '../dao/productManagerDao.js';
import { rutaProductos } from '../utils.js';
import mongoose from 'mongoose';

export const router=Router()

let productManager=new ProductManager(rutaProductos)

router.get('/', async (req, res) => {
    try {
        // Utiliza populate para cargar los datos relacionados (si es necesario)
        const productos = await modeloProductos.find().populate('carrito').lean();
        res.status(200).render('productos', { productos });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

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
        return res.status(500).json({error:`Error inesperado en el servidor`})
    }
    req.io.emit("nuevoProducto", nuevoProducto)

    res.setHeader('Content-Type','application/json')
    res.status(201).json({nuevoProducto})
})

router.put('/:id', async (req, res) => {
    let { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Id inválido` })
    }

    let aModificar = req.body
    if (aModificar._id) {
        delete aModificar._id
    }

    try {
        let resultado = await productManager.update(id, aModificar)
        if (resultado.modifiedCount > 0) {
            res.status(200).json({
                message: `Producto actualizado correctamente`
            })
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existe el producto con id ${id}` })
        }
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json(
            {
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            }
        )
    }
})


router.delete('/:id',async(req,res)=>{
    let {id}=req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Id invalido`})
    }

    try {
        let resultado=await productManager.delete(id)
        if(resultado.deletedCount>0){
            res.status(200).json({
                message:`Producto eliminado correctamente`
            })
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No existe el producto con id ${id}`})
        }
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
        
    }

})

    export default router;
