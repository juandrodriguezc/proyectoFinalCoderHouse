import {ProductManager as ProductDao} from "../dao/productManagerDao.js";

const productDao=new ProductDao()

export default class productosController{
    static getProductos=async (req, res) => {
        try {
            // Utiliza populate para cargar los datos relacionados (si es necesario)
            const productos = await productDao.getProduct();
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

    static getProductosById=async (req, res) => {
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
    }
}