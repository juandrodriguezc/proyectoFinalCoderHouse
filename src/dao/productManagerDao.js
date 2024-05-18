import { modeloProductos } from '../dao/models/producto.modelo.js';

export class ProductManager {
    constructor() {
    }
    
    // Función para obtener todos los productos
    async getProduct() {
        try {
            const productos = await modeloProductos.find().lean();
            return productos;
        } catch (error) {
            console.error("Error al obtener productos:", error);
            return [];
        }
    }

    async getProductById(id){
        return await modeloProductos.findById(id).lean()
    }
    
    // Función para crear un nuevo producto
    async addProduct(nombre, precio) {
        try {
            const newProduct = await modeloProductos.create({ nombre, precio });
            console.log('Producto agregado:', newProduct);
            return newProduct;
        } catch (error) {
            console.error("Error al agregar un nuevo producto:", error);
            throw error;
        }
    }

    //funcion para modificar producto
    async update(id, modificacion={}){
        return await modeloUsuarios.updateOne({_id:id}, modificacion)
    }
    // Función para eliminar un producto
    async deleteProduct(id) {
        try {
            const deletedProduct = await modeloProductos.findByIdAndDelete(id).lean();
            if (deletedProduct) {
                console.log("Producto eliminado correctamente");
            } else {
                console.log("Error: Producto no encontrado");
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            throw error;
        }
    }
}