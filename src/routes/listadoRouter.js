import { Router } from 'express';
import {ProductManager} from '../dao/productManagerDao.js';
import { passportCall, rutaProductos } from '../utils.js';
import { modeloProductos } from '../dao/models/productos.modelo.js';
import { modeloCarrito } from '../dao/models/carrito.modelo.js';
import { auth } from '../middlewares/auth.js';
import { CartManager as CartDao } from '../dao/cartManagerDao.js';

export const router=Router()

const cartDao =new CartDao()

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
            const carritoId = req.user.usuario.carrito; // Accede correctamente a la propiedad carrito
            console.log('ID del carrito:', carritoId);
    
            if (!carritoId) {
                return res.status(400).send('ID de carrito no disponible');
            }
    
            const carrito = await cartDao.getOneByPopulate({ _id: carritoId });
            console.log('Carritooo:', carrito);
    
            res.setHeader('Content-Type', 'text/html');
            res.status(200).render('carrito', { usuario: req.user.usuario, carrito });
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            res.status(500).send('Error al obtener el carrito');
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