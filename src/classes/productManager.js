import fs from 'fs';

export class ProductManager {
    constructor(rutaProductos) {
        this.rutaProductos = rutaProductos;
        this.products=[]
    }

    async getProduct() {
        try {
            const data = await fs.promises.readFile(this.rutaProductos, { encoding: "utf-8" });
            return JSON.parse(data);
        } catch (error) {
            console.error("Error al obtener productos:", error);
            return [];
        }
    }

    async idUnico(productos) {
        let id = 1;
        if (productos.length > 0) {
            id = productos[productos.length - 1].id + 1;
        }
        return id;
    }

    async addProduct(nombre, precio) {
        const productos = await this.getProduct(); // Obtener los productos existentes
        const id = await this.idUnico(productos); // Obtener un ID único para el nuevo producto
        const newProduct = { id, nombre, precio }; // Crear el nuevo producto con el nombre y el ID
        productos.push(newProduct); // Agregar el nuevo producto a la lista existente de productos
        await this.saveProducts(productos); // Guardar la lista actualizada de productos
        console.log('Producto agregado:', newProduct);
        return newProduct;
    }


async saveProducts(products) {
    try {
        if (products) {
            await fs.promises.writeFile(this.rutaProductos, JSON.stringify(products, null, 2));
            console.log("Productos guardados correctamente");
        } else {
            console.error("Error: La lista de productos es undefined");
        }
    } catch (error) {
        console.error("Error al guardar los productos:", error);
    }
}

    // async deleteProduct(id) {
    //     try {
    //         let productos = await this.getProduct();
    //         const initialLength = productos.length;
    //         productos = productos.filter(producto => producto.id !== id);
    //         if (productos.length === initialLength) {
    //             console.log("Error: Producto no encontrado");
    //         } else {
    //             await this.saveProducts(productos);
    //             console.log("Producto eliminado correctamente");
    //         }
    //     } catch (error) {
    //         console.error("Error al eliminar el producto:", error);
    //     }
    // }

}

export default ProductManager;
