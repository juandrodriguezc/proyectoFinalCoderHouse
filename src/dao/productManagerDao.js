import { modeloProductos } from "../dao/models/productos.modelo.js";

export class ProductManager {
  constructor() {}

  // Función para obtener todos los productos
  async getProducts(filtro = {}) {
    try {
      return await modeloProductos.find(filtro).lean();
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw new Error('Error al obtener productos');
    }
  }

  // Función para obtener un producto por su ID
  async getProductById(filtro = {}) {
    try {
      return await modeloProductos.findOne(filtro).lean();
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      throw new Error('Error al obtener el producto');
    }
  }

  // Función para crear un nuevo producto
  async addProduct(nombre, precio, code) {
    try {
      return await modeloProductos.create({ nombre, precio, code });
    } catch (error) {
      console.error('Error al crear el producto:', error);
      throw new Error('Error al crear el producto');
    }
  }

  // Función para modificar un producto
  async update(id, producto) {
    try {
      // Verificar si el producto con el mismo code ya existe
      const { code } = producto;
      const productoExistente = await modeloProductos.findOne({ code });

      if (productoExistente && productoExistente._id.toString() !== id.toString()) {
        throw new Error(`Ya existe un producto con el code ${code}`);
      }

      return await modeloProductos.updateOne({ _id: id }, producto);
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      throw new Error('Error al actualizar el producto');
    }
  }

  // Función para eliminar un producto
  async deleteProduct(id) {
    try {
      return await modeloProductos.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      throw new Error('Error al eliminar el producto');
    }
  }
}

