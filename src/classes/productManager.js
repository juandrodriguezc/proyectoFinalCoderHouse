import fs from 'fs';
import path from 'path';
import { rutaProductos } from '../utils.js';
    
export class ProductManager {
    constructor(rutaProductos) {
        this.rutaProductos = rutaProductos;
        this.products= this.loadProductsFromFile(); // Cargar productos desde el archivo al instanciar ProductManager
    }

    loadProductsFromFile() {
        try {
            const data = fs.readFileSync(this.rutaProductos, 'utf8');
            console.log('Productos cargados correctamente desde el archivo.');
            return JSON.parse(data);
        } catch (err) {
            console.error('Error al cargar productos desde el archivo:', err);
            return [];
        }
    }


getProduct() {
    return this.products;
}

addProduct(nombre, descripcion, precio = 0, thumbnail, code, stock = 0) {
    if (!nombre || !descripcion || precio===undefined || !thumbnail || !code || stock===undefined) {
        console.log(" Por favor complete todos los datos");
        return; 
    }
    
    const id = this.idUnico();
    //Variable para agregar los productos
    const newProduct = {id, nombre, descripcion, precio, thumbnail, code, stock};
    this.products.push(newProduct);
    this.saveProducts();
    console.log('Producto agregado:', newProduct);

    return newProduct;
    
}
getProductById(id) {
    const product = this.products.find(product => product.id === id);
    if (product) {
        return product;
    } else {
        console.log("Error: Producto no encontrado");
        return null;
    }
}

idUnico(){
//Para agregar el ID que se autoincremente
let id = 1; 
    
if (this.products.length > 0) {
    id = this.products[this.products.length - 1].id + 1;
}
return id;
}

saveProducts(){
    fs.writeFileSync(this.rutaProductos, JSON.stringify(this.products, null, 2));
}

//Actualizar el producto
updateProduct(id, NuevaInfo) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
        
        const updatedProduct = { ...this.products[index], ...NuevaInfo };
        
        updatedProduct.id = id;
        
        this.products[index] = updatedProduct;
        console.log("Producto actualizado correctamente");
        // this.saveProducts();
        return true;
    } else {
        console.log("No se pudo actualizar, ya que el producto no se encontró");
        return false;
    }
}

//Para eliminar un producto
deleteProduct(id) {
    const initialLength = this.products.length;
    this.products = this.products.filter(product => product.id !== id);
    if (this.products.length === initialLength) {
        console.log("Error: Producto no encontrado");
    } else {
        console.log("Producto eliminado correctamente");
        this.saveProducts();
    }
}
}
//Creando los productos
const manager = new ProductManager(rutaProductos);

// manager.addProduct('Pizza', '2x1 Todos los Lunes y Martes', 200, 'thumbnail1.jpg', 'code1', 100);
// manager.addProduct('Rolls', '3x2 Todos los Miercoles y Jueves', 100, 'thumbnail2.jpg', 'code2', 200 );

// manager.addProduct('Descuentos', '2x1 Todos los Lunes y Martes', 200, 'thumbnail1.jpg', 'code1', 100);


const products = manager.getProduct();
console.log('Lista de productos:', products);

const productoEncontrado = manager.getProductById(1);{
console.log('Producto encontrado:', productoEncontrado);
}

// Actualizar un producto existente
const idProductoActualizar = 1;
const nuevosDatos = {
precio: 250,
stock: 120 
};

manager.updateProduct(idProductoActualizar, nuevosDatos);

// setTimeout(() =>{
// const productoEliminado = 4; // Id del producto que se desea eliminar
// manager.deleteProduct(productoEliminado);

// console.log('Lista de productos actualizada:', manager.getProduct());
// },3000)

export default ProductManager;