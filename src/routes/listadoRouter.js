import { Router } from 'express';
import ProductManager from '../dao/productManagerDao.js';
import { rutaProductos } from '../utils.js';
import { modeloProductos } from '../dao/models/producto.modelo.js';


export const router=Router()

let productsManager=new ProductManager(rutaProductos)

router.get('/',(req,res)=>{
    let {nombre}=req.query
    res.status(200).render('inicio', {nombre})
})

router.get('/productos',async(req,res)=>{

    let {pagina}=req.query
    if(!pagina){
        pagina=1
    }

    let {
        docs:productos,
        totalPages, 
        prevPage, nextPage, 
        hasPrevPage, hasNextPage
    } = await modeloProductos.paginate({},{limit:3, page:pagina, lean:true})

    console.log(JSON.stringify(productos, null, 5 ))

    res.setHeader('Content-Type','text/html')
    res.status(200).render("productos",{
        productos,
        totalPages, 
        prevPage, nextPage, 
        hasPrevPage, hasNextPage
    })
})


export default router;