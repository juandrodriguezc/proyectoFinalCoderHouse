// // import fs from 'fs';
// import { modeloProductos } from "./models/producto.modelo";

// export class ProductManager {
//     constructor(rutaProductos) {
//         this.rutaProductos = rutaProductos;
//         this.products=[]
//     }
//     //función para obtener los productos ya creados
//     async getProduct() {
//         try {
//             const data = await fs.promises.readFile(this.rutaProductos, { encoding: "utf-8" });
//             return JSON.parse(data);
//         } catch (error) {
//             console.error("Error al obtener productos:", error);
//             return [];
//         }
//     }
//     //función para IdUnico
//     async idUnico(productos) {
//         let id = 1;
//         if (productos.length > 0) {
//             id = productos[productos.length - 1].id + 1;
//         }
//         return id;
//     }

//     //Función para crear nuevo producto
//     async addProduct(nombre, precio) {
//         const productos = await this.getProduct();
//         const id = await this.idUnico(productos); 
//         const newProduct = { id, nombre, precio }; 
//         productos.push(newProduct); // 
//         await this.saveProducts(productos);
//         console.log('Producto agregado:', newProduct);
//         return newProduct;
//     }

// //Función para guardar los productos
// async saveProducts(products) {
//     try {
//         if (products) {
//             await fs.promises.writeFile(this.rutaProductos, JSON.stringify(products, null, 2));
//             console.log("Productos guardados correctamente");
//         } else {
//             console.error("Error: La lista de productos es undefined");
//         }
//     } catch (error) {
//         console.error("Error al guardar los productos:", error);
//     }
// }
// //Función para eliminar productos, pero que en este desafio no lo utilicé
//     // async deleteProduct(id) {
//     //     try {
//     //         let productos = await this.getProduct();
//     //         const initialLength = productos.length;
//     //         productos = productos.filter(producto => producto.id !== id);
//     //         if (productos.length === initialLength) {
//     //             console.log("Error: Producto no encontrado");
//     //         } else {
//     //             await this.saveProducts(productos);
//     //             console.log("Producto eliminado correctamente");
//     //         }
//     //     } catch (error) {
//     //         console.error("Error al eliminar el producto:", error);
//     //     }
//     // }

// }

// export default ProductManager;
