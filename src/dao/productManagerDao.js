import { modeloProductos } from "../dao/models/productos.modelo.js";

export class ProductManager {
  constructor() {}

  // Función para obtener todos los productos
  async getProducts(filtro = {}) {
    return await modeloProductos.find(filtro).lean();
  }

  async getProductById(filtro = {}) {
    return await modeloProductos.findOne(filtro).lean();
  }

  // Función para crear un nuevo producto
  async addProduct(nombre, precio) {
    const newProduct = await modeloProductos.create({ nombre, precio });
  }

  //funcion para modificar producto
  async update(id, producto) {
    return await modeloProductos.updateOne({ _id: id }, producto);
  }
  // Función para eliminar un producto
  async deleteProduct(id) {
    return await modeloProductos.findByIdAndDelete(id).lean();
  }
}
