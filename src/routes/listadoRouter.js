import { Router } from 'express';
import {ProductManager} from '../dao/productManagerDao.js';
import { passportCall, rutaProductos } from '../utils.js';
import { modeloProductos } from '../dao/models/productos.modelo.js';
import { modeloCarrito } from '../dao/models/carrito.modelo.js';
import { auth } from '../middlewares/auth.js';



export const router=Router()

let productsManager=new ProductManager(rutaProductos)

router.get('/',(req,res)=>{
    let {nombre}=req.query
    res.status(200).render('inicio', {nombre})
})

    router.get('/productos', passportCall('current'), async (req, res) => {
        try {
            let { pagina } = req.query;
            if (!pagina) {
                pagina = 1;
            }
            if (!req.session.usuario) {
                // Si el usuario no está autenticado, redirigirlo al inicio de sesión
                return res.redirect('/login');
            }
            const nombreUsuario = req.session.usuario.nombre;
            
            let {
                docs: productos,
                totalPages,
                prevPage,
                nextPage,
                hasPrevPage,
                hasNextPage
            } = await modeloProductos.paginate({}, { limit: 3, page: pagina, lean: true });
    
            console.log(JSON.stringify(productos, null, 5));
            console.log(req.session);
    
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render("productos", {
                nombreUsuario,
                productos,
                totalPages,
                prevPage,
                nextPage,
                hasPrevPage,
                hasNextPage
            });
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).send('Error al obtener productos');
        }
    });

    router.get('/carts', passportCall('current'), async (req, res) => {
        try {
            console.log('Usuario:', req.user);
            const carrito = await modeloCarrito
                .findOne({ usuario: req.user._id })
                .populate('productos.producto') 
                .lean();
    
            if (!carrito) {
                return res.status(404).send('Carrito no encontrado');
            }
    
            const carritoData = {
                _id: carrito._id,
                productos: carrito.productos.map(p => ({
                    descripcion: p.producto.descripcion,
                    cantidad: p.cantidad,
                    precio: p.producto.precio
                }))
            };
    
            const usuarioData = {
                nombre: req.user.nombre,
                _id: req.user._id
            };
    
            res.status(200).render('carrito', { carrito: carritoData, usuario: usuarioData });
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
            res.status(500).send('Error al obtener los carritos');
        }
    });
    

router.get('/registro',(req,res)=>{

    let {error, mensaje} = req.query

    res.status(200).render('registro', {error, mensaje})
})

router.get('/login',(req,res)=>{

    res.status(200).render('login')
})

router.get('/recuperacion', (req, res)=>{
    res.status(200).render('recuperacion')
})

router.get('/recuperacion2', (req, res)=>{
    res.status(200).render('recuperacion2')
})

router.get('/recuperacion3', (req, res)=>{
    res.status(200).render('recuperacion3')
})
export default router;