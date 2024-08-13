import { isValidObjectId } from "mongoose";
import { CartManager as CartDao } from "../dao/cartManagerDao.js";
import { ProductManager as ProductDao } from "../dao/productManagerDao.js";
import { TicketsDAO as TicketsDAO } from "../dao/ticketDao.js";
import { sendEmail } from "../utils.js";
import mongoose from "mongoose";

const productDao=new ProductDao()
const cartDao=new CartDao()
const ticketsDAO=new TicketsDAO()
export default class carritoController{

    static getCarrito=async (req, res) => {
        try {
            const carts = await cartDao.getCarts();
            res.status(200).json({carts});
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
            res.status(500).send('Error al obtener los carritos');
        }
    }

    static createCarrito=async (req, res) => {
        try {
            const newCart = await cartDao.createCart({});
            res.status(201).json(newCart);
        } catch (error) {
            console.error('Error al crear un nuevo carrito:', error);
            res.status(500).send('Error al crear un nuevo carrito');
        }
    }

    static getCarritoById = async (req, res) => {
        const { id } = req.params;
        console.log('ID del carrito recibido:', id);
    
        // Validar si el ID es un ObjectId de MongoDB válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Ingrese un ID de MongoDB válido' });
        }
    
        try {
            // Obtener el carrito de la base de datos
            const carrito = await cartDao.getCartById({ _id: id });
    
            // Verificar si el carrito fue encontrado
            if (!carrito) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
    
            // Enviar el carrito como respuesta JSON
            console.log('Carrito encontrado:', carrito);
            return res.status(200).json({ carrito });
        } catch (error) {
            // Manejo de errores en caso de falla en la base de datos u otros problemas
            console.error('Error al obtener el carrito:', error);
            return res.status(500).json({ error: 'Error al obtener el carrito' });
        }
    }
    static getProductInCart = async (req, res) => {
        let { cid, pid } = req.params;
    
        if (!cid || !pid) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ingrese cid y pid` });
        }
    
        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ingrese cid / pid con formato válido de MongoDB id` });
        }
    
        try {
            let carrito = await cartDao.getCartById({ _id: cid });
            if (!carrito) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Carrito inexistente: ${cid}` });
            }
    
            let producto = await productDao.getProductById({ _id: pid });
            if (!producto) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Producto inexistente: ${pid}` });
            }
    
            if (producto.stock <= 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `No hay stock para el producto: ${pid}` });
            }
    
            // Verificación de la existencia de producto en el carrito
            let indiceProducto = carrito.productos.findIndex(p => p.producto && p.producto.toString() === pid);
            
            if (indiceProducto === -1) {
                carrito.productos.push({
                    producto: pid, cantidad: 1
                });
            } else {
                carrito.productos[indiceProducto].cantidad++;
            }
    
            try {
                let resultado = await cartDao.update(cid, carrito);
                if (resultado.modifiedCount > 0) {
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(200).json({ payload: "Carrito actualizado...!!!" });
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    return res.status(500).json({
                        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    });
                }
            } catch (error) {
                console.log(error);
                res.setHeader('Content-Type', 'application/json');
                return res.status(500).json({
                    error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle: `${error.message}`
                });
            }
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            });
        }
    }
    


    //     const { id: cartId, productId } = req.params;
    //     console.log('ID del carrito recibido:', cartId);
    //     console.log('ID del producto recibido:', productId);
    
    //     if (!isValidObjectId(productId) || !isValidObjectId(cartId)) {
    //         console.log('ID de producto o carrito no válido:', { productId, cartId });
    //         return res.status(400).send('Error: ID de producto o carrito no válido');
    //     }
    
    //     try {
    //         const productToAdd = await productDao.getProductById({ _id: productId });
    //         if (!productToAdd) {
    //             return res.status(404).send('Error 404. Producto no encontrado');
    //         }
    
    //         const updatedCart = await cartDao.addProductToCart(cartId, productToAdd);
    //         if (!updatedCart) {
    //             return res.status(404).send('Error 404. Carrito no encontrado');
    //         }
    
    //         res.status(200).json(updatedCart);
    //     } catch (error) {
    //         console.error('Error al agregar un producto al carrito:', error);
    //         res.status(500).send('Error al agregar un producto al carrito');
    //     }
    // }
    static async comprarCarrito(req, res) {
        const { cid } = req.params;

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ error: 'ID de carrito inválido' });
        }

        try {
            // Obtener carrito
            const carrito = await cartDao.getCartById({ _id: cid });
            if (!carrito) {
                return res.status(400).json({ error: `Carrito inexistente. Id: ${cid}` });
            }

            // Verificar si el carrito está vacío
            if (carrito.productos.length === 0) {
                return res.status(400).json({ error: 'Carrito vacío' });
            }

            const conStock = [];
            const sinStock = [];
            let total = 0;

            // Procesar productos
            for (const item of carrito.productos) {
                const pid = item.producto; // ID del producto
                const cantidad = item.cantidad; // Cantidad del producto

                if (!isValidObjectId(pid)) {
                    console.log(`ID de producto inválido: ${pid}`);
                    sinStock.push({ producto: pid, cantidad });
                    continue;
                }

                const producto = await productDao.getProductById({ _id: pid });
                if (!producto) {
                    console.log(`Producto con ID ${pid} no encontrado.`);
                    sinStock.push({ producto: pid, cantidad });
                } else if (isNaN(producto.stock) || isNaN(cantidad) || producto.stock < cantidad) {
                    console.log(`Producto ${pid} sin stock suficiente o con valores inválidos. Cantidad disponible: ${producto.stock}`);
                    sinStock.push({ producto: pid, cantidad });
                } else {
                    const nuevoStock = producto.stock - cantidad;

                    // Validar que el nuevo stock es un número válido
                    if (isNaN(nuevoStock)) {
                        console.error(`Stock inválido calculado para el producto ${pid}: ${nuevoStock}`);
                        sinStock.push({ producto: pid, cantidad });
                        continue;
                    }

                    conStock.push({
                        _id: pid,
                        descripcion: producto.descripcion,
                        cantidad,
                        precio: producto.precio,
                        subtotal: producto.precio * cantidad,
                        stockPrevioCompra: producto.stock
                    });
                    producto.stock = nuevoStock;
                    await productDao.update(pid, producto);
                    total += cantidad * producto.precio;
                }
            }

            if (conStock.length === 0) {
                return res.status(400).json({ error: 'No hay ítems para comprar' });
            }

            const nroComp = Date.now();
            const fecha = new Date();
            const email = req.user.usuario.email;

            // Crear ticket
            const nuevoTicket = await ticketsDAO.create({
                nroComp,
                fecha,
                email,
                items: conStock,
                total
            });

            // Actualizar carrito
            carrito.productos = sinStock;
            await cartDao.update(cid, carrito);

            // Mensaje para el usuario
            const mensaje = `Su compra ha sido procesada...!!!
            Ticket: ${nroComp} - importe a pagar:$ ${total} 
            Contacte a: rodriguezcolmenaresjuand@gmail.com, para mas informacion
            ${sinStock.length > 0 ? `Algunos items del carrito no fueron procesados. Verifique: ${JSON.stringify(sinStock, null, 5)}` : ''}`;

            // Enviar email
            await sendEmail(email, 'Compra realizada con éxito...!!!', mensaje);

            return res.status(200).json({ nuevoTicket });
        } catch (error) {
            console.error('Error al comprar el carrito:', error);
            return res.status(500).json({
                error: 'Error inesperado en el servidor',
                detalle: `${error.message}`
            });
        }
    }
}