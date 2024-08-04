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
  async addProduct(nombre, precio, code) {
    return await modeloProductos.create({ nombre, precio, code });
  }

  //funcion para modificar producto
  async update(id, producto) {
    const productoExistente = await modeloProductos.findOne({ code });
        if (productoExistente) {
          return res
          .status(400)
          .json({ error: `Ya existe un producto con el code ${code}` })
        }
    return await modeloProductos.updateOne({ _id: id }, producto);
  }
  // Función para eliminar un producto
  async deleteProduct(id) {
    return await modeloProductos.findByIdAndDelete(id);
  }
}
