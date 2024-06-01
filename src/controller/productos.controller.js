import { isValidObjectId } from "mongoose";
import {ProductManager as ProductDao} from "../dao/productManagerDao.js";

const productDao=new ProductDao()

export default class productosController{
    static getProductos=async (req, res) => {
        try {
            // Utiliza populate para cargar los datos relacionados (si es necesario)
            const productos = await productDao.getProducts();
            res.status(200).render('productos', { productos });
        } catch (error) {
            console.error("Error al obtener productos:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    };
    
    static crearProducto=async(req, res) => {

        const {nombre, precio}=req.body
        console.log('Nombre del producto recibido:', nombre)
        if(!nombre || !precio){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Complete los datos del producto`})
        }
    
        let nuevoProducto=await productDao.addProduct(nombre, precio);   
        if(!nuevoProducto){
            res.setHeader('Content-Type','application/json');
            return res.status(500).json({error:`Error inesperado en el servidor`})
        }
        req.io.emit("nuevoProducto", nuevoProducto)
    
        res.setHeader('Content-Type','application/json')
        res.status(201).json({nuevoProducto})
    }

    static eliminarProducto= async(req,res)=>{
        let {id}=req.params
        if(!isValidObjectId(id)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Id invalido`})
        }
    
        try {
            let resultado=await productDao.deleteProduct(id)
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
    }    

    static getProductosById=async (req, res) => {
        let {id}=req.params
        if(!isValidObjectId(id)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ingrese un id de MongoDB válido`})
        }

        let producto=await productDao.getProductById({_id:id})

        res.setHeader('Content-Type','application/json')
        res.status(200).json({producto})
    }
}