import { isValidObjectId } from "mongoose";
import { CartManager as CartDao } from "../dao/cartManagerDao.js";
import { ProductManager as ProductDao } from "../dao/productManagerDao.js";

const productDao=new ProductDao()
const cartDao=new CartDao()

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
        const { id: cartId, productId } = req.params;
        console.log('ID del carrito recibido:', cartId);
        console.log('ID del producto recibido:', productId);
    
        if (!isValidObjectId(productId) || !isValidObjectId(cartId)) {
            console.log('ID de producto o carrito no válido:', { productId, cartId });
            return res.status(400).send('Error: ID de producto o carrito no válido');
        }
    
        try {
            const productToAdd = await productDao.getProductById({ _id: productId });
            if (!productToAdd) {
                return res.status(404).send('Error 404. Producto no encontrado');
            }
    
            const updatedCart = await cartDao.addProductToCart(cartId, productToAdd);
            if (!updatedCart) {
                return res.status(404).send('Error 404. Carrito no encontrado');
            }
    
            res.status(200).json(updatedCart);
        } catch (error) {
            console.error('Error al agregar un producto al carrito:', error);
            res.status(500).send('Error al agregar un producto al carrito');
        }
    }

    static comprarCarrito = async (req, res) => {
        let { cid } = req.params;
        if (!isValidObjectId(cid)) {
            return res.status(400).json({ error: `ID de carrito inválido` });
        }

        try {
            let carrito = await cartDao.getCartById({ _id: cid });
            if (!carrito) {
                return res.status(400).json({ error: `Carrito inexistente. Id: ${cid}` });
            }

            if (carrito.productos.length === 0) {
                return res.status(400).json({ error: `Carrito vacío` });
            }

            let conStock = [];
            let sinStock = [];
            let total = 0;

            for (let i = 0; i < carrito.productos.length; i++) {
                let pid = carrito.productos[i].producto;
                let cantidad = carrito.productos[i].cantidad;
                let producto = await productDao.getProductById({ _id: pid });

                if (!producto || producto.stock - cantidad < 0) {
                    sinStock.push({ producto: pid, cantidad });
                } else {
                    conStock.push({
                        _id: pid,
                        descripcion: producto.descripcion,
                        cantidad,
                        precio: producto.precio,
                        subtotal: producto.precio * cantidad,
                        stockPrevioCompra: producto.stock
                    });
                    producto.stock -= cantidad;
                    await productosDAO.update(pid, producto);
                    total += cantidad * producto.precio;
                }
            }

            if (conStock.length === 0) {
                return res.status(400).json({ error: `No hay ítems en condiciones de ser facturados` });
            }

            let nroComp = Date.now();
            let fecha = new Date();
            let email = req.user.email;

            let nuevoTicket = await ticketsDAO.create({
                nroComp, fecha, email,
                items: conStock, total
            });

            carrito.productos = sinStock;
            await carritosDAO.update(cid, carrito);

            let mensaje = `Su compra ha sido procesada...!!! <br>
            Ticket: <b>${nroComp}</b> - importe a pagar: <b><i>$ ${total}</b></i> <br>
            Contacte a pagos para finalizar la operación: pagos@cuchuflito.com
            <br><br>
            ${sinStock.length > 0 ? `Algunos items del carrito no fueron procesados. Verifique: ${JSON.stringify(sinStock, null, 5)}` : ""}`;

            await sendEmail(email, "Compra realizada con éxito...!!!", mensaje);

            return res.status(200).json({ nuevoTicket });
        } catch (error) {
            return res.status(500).json({
                error: `Error inesperado en el servidor`,
                detalle: `${error.message}`
            });
        }
    };
    }
