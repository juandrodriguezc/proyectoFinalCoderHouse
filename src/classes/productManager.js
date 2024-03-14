import fs from 'fs';
import { rutaProductos } from '../utils.js';

export class ProductManager {
    constructor(ruta) {
        this.path = ruta;
    }

    async getProduct() {
        try {
            const data = await fs.promises.readFile(this.path, { encoding: "utf-8" });
            return JSON.parse(data);
        } catch (error) {
            console.error("Error al obtener productos:", error);
            return [];
        }
    }

    async create(productoNuevo) {
        try {
            let productos = await this.getProduct();
            const id = this.idUnico(productos);
            const nuevoProducto = { id, ...productoNuevo }; // Combinar solo con los datos del nuevo producto
            productos.push(nuevoProducto);
            await fs.promises.writeFile(this.path, JSON.stringify(productos, null, 5));
            return nuevoProducto;
        } catch (error) {
            console.error("Error al crear el producto:", error);
            throw error; // Lanzar la excepción nuevamente para que el llamador pueda manejarla
        }
    }

    idUnico(productos) {
        let id = 1;
        if (productos.length > 0) {
            id = productos[productos.length - 1].id + 1;
        }
        return id;
    }

    async saveProducts(products) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            console.log("Productos guardados correctamente");
        } catch (error) {
            console.error("Error al guardar los productos:", error);
        }
    }

    async deleteProduct(id) {
        try {
            let productos = await this.getProduct();
            const initialLength = productos.length;
            productos = productos.filter(producto => producto.id !== id);
            if (productos.length === initialLength) {
                console.log("Error: Producto no encontrado");
            } else {
                await this.saveProducts(productos);
                console.log("Producto eliminado correctamente");
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    }

    async updateProduct(id, nuevosDatos) {
        try {
            let productos = await this.getProduct();
            const index = productos.findIndex(producto => producto.id === id);
            if (index !== -1) {
                productos[index] = { ...productos[index], ...nuevosDatos };
                await this.saveProducts(productos);
                console.log("Producto actualizado correctamente");
            } else {
                console.log("Error: Producto no encontrado");
            }
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    }
}

export default ProductManager;
