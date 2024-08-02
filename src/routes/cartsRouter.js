import { Router } from "express";
import carritoController from "../controller/carrito.controller.js";
import { sendEmail } from "../utils.js";
import mongoose, { isValidObjectId } from "mongoose";
import {ProductManager as ProductDao} from "../dao/productManagerDao.js";
import { CartManager as CartDao } from "../dao/cartManagerDao.js";
import {TicketsDAO} from '../dao/ticketDao.js'

const carritosDAO=new CartDao()
const productosDAO=new ProductDao()
const ticketsDAO=new TicketsDAO()

    export const router = Router();

    // Obtener todos los carritos
    router.get('/', carritoController.getCarrito)

    // Obtener un carrito por su ID
    router.get('/:id', carritoController.getCarritoById)

    router.post('/', carritoController.createCarrito)

    // Agregar un producto a un carrito
    router.post('/:id/productos/:productId', carritoController.getProductInCart);

    router.get("/comprar/:cid", async(req, res)=>{
        let {cid}=req.params
        if(!isValidObjectId(cid)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Se ha ingresado un id de carrito inválido`})
        }
    
        let carrito=await carritosDAO.getCartById({_id: cid})  
        if(!carrito){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Carrito inexistente. Id: ${cid}`})
        }
    
        if(carrito.productos.length===0){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Carrito vacío...!!!`})
        }
    
        try {
            let conStock=[]
            let sinStock=[]
            let total=0
            // console.log(JSON.stringify(carrito.productos,null, 5))
            for(let i=0; i<carrito.productos.length; i++){
                // let pid=carrito.productos[i]._id
                let pid=carrito.productos[i].producto
                let cantidad=carrito.productos[i].cantidad
                let producto=await productosDAO.getProductById({_id: pid})
                if(!producto || producto.stock-cantidad<0){
                    sinStock.push(
                        {
                            producto: pid, cantidad
                        }
                    )
                }else{
                    conStock.push(
                        {
                            _id: pid, 
                            descripcion: producto.descripcion,
                            cantidad, 
                            precio: producto.precio, 
                            subtotal: producto.precio*cantidad,
                            stockPrevioCompra: producto.stock
                        }
                    )
                    producto.stock=producto.stock-cantidad
                    await productosDAO.update(pid, producto)
                    total+=cantidad*producto.precio
                }
            }
    
            // console.log({sinStock})
            // console.log({conStock})
            // console.log({total})
            if(conStock.length===0){
                res.setHeader('Content-Type','application/json');
                return res.status(400).json({error:`No hay ítems en condiciones de ser facturados (verificar stock / existencia del producto)`})
            }
            let nroComp=Date.now()
            let fecha=new Date()
            let email=req.user.email
    
            let nuevoTicket=await ticketsDAO.create(
                {
                    nroComp, fecha, email, 
                    items: conStock, total
                }
            )
    
            carrito.productos=sinStock
            await carritosDAO.update(cid, carrito)
    
            let mensaje=`Su compra ha sido procesada...!!! <br>
    Ticket: <b>${nroComp}</b> - importe a pagar: <b><i>$ ${total}</b></i> <br>
    Contacte a pagos para finalizar la operación: pagos@cuchuflito.com
    <br><br>
    ${sinStock.length>0?`Algunos items del carrito no fueron procesados. Verifique: ${JSON.stringify(sinStock, null, 5)}`:""}`
    
            sendEmail(email, "Compra realizada con éxito...!!!", mensaje)
            
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({nuevoTicket});
        
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle:`${error.message}`
                }
            )
        }
    })
