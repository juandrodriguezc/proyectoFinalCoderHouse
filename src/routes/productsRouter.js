import { Router } from 'express';
import {ProductManager} from '../classes/productManager.js';
import { rutaProductos } from '../utils.js';

export const router=Router()

let productManager=new ProductManager(rutaProductos)

router.get('/', (req, res)=>{
    let productos=productManager.getProduct()
    res.status(200).json({productos})
})

    router.get('/', (req, res) => {
        const { limit, skip } = req.query;

        let resultado = productManager.getProduct(); 

        if (skip && skip > 0) {
            resultado = resultado.slice(skip); 
        }

        if (limit && limit > 0) {
            resultado = resultado.slice(0, limit);
        }

        res.json(resultado);
    });

    // router.get('/:id', (req, res) => {
    //     const productId = parseInt(req.params.id);
    //     const producto = productManager.getProductById(productId);
    //     if (producto) {
    //         res.json(producto);
    //     } else {
    //         res.status(404).send('Error 404. Producto no encontrado');
    //     }
    // });

    // router.post('/', (req, res) => {
    //     const { nombre, descripcion, precio = 0, thumbnail, code, stock = 0 } = req.body;

    //     if (!nombre || !descripcion || precio === undefined || !thumbnail || !code || stock === undefined) {
    //         return res.status(400).json({ error: 'Por favor complete todos los datos del producto' });
    //     }

    //     const newProduct = productManager.addProduct(nombre, descripcion, precio, thumbnail, code, stock);

    //     return res.status(201).json(newProduct);
    // });

    export default Router;
