import { Router } from 'express';
import { UsuariosManagerDao } from '../dao/usuariosManagerDao.js';
import { creaHash } from '../utils.js';
import passport from 'passport';
export const router=Router()

let usuariosManager=new UsuariosManagerDao()

router.get("/errorRegistro", (req, res)=>{
    return res.redirect("/registro?error=Error al registrarse")
})

router.post('/registro', passport.authenticate("registro", {failureRedirect:"/api/sessions/errorRegistro"}), async(req,res)=>{

    return res.redirect(`/registro?mensaje=Registro exitoso para ${req.user.nombre}`)

})

router.get("/errorLogin", (req, res)=>{
    return res.status(400).json({error:`Error al logearse`})
})

router.post('/login', passport.authenticate("login", {failureRedirect:"/api/sessions/errorLogin"}), async(req,res)=>{
// router.post('/registro',async(req,res)=>{

//     let {nombre, email, password} =req.body
//     if(!nombre || !email || !password){
//         res.setHeader('Content-Type','application/json');
//         return res.status(400).json({error:`Faltan datos`})
//     } 

//     let existe=await usuariosManager.getBy({email})
//     if(existe){
//         res.setHeader('Content-Type','application/json');
//         return res.status(400).json({error:`Ya existen usuarios con email ${email}`})

//     }
//     password=creaHash(password)

//     try {
//         let nuevoUsuario=await usuariosManager.create({nombre, email, password})

//         res.setHeader('Content-Type','application/json');
//         return res.status(200).json({payload:"Registro exitoso", nuevoUsuario});

//     } catch (error) {
//         return res.status(500).json({error: `Error inesperado`})
        
//     }


// })

// router.post('/login',async(req,res)=>{

//     let {email, password} =req.body
//     if(!email || !password){
//         res.setHeader('Content-Type','application/json');
//         return res.status(400).json({error:`Faltan datos`})
//     }

//     let usuario=await usuariosManager.getBy({email})
//     if(!usuario){
//         res.setHeader('Content-Type','application/json');
//         return res.status(401).json({error:`Correo incorrecto`})
//     }

//     if(usuario.password!==creaHash(password)){
//         res.setHeader('Content-Type','application/json');
//         return res.status(401).json({error:`Contraseña incorrecta`})
//     }
    let usuario=req.user
    usuario={...usuario}
    delete usuario.password
    req.session.usuario=usuario

    if (usuario.email === 'adminCoder@coder.com') {
        // Asignar el rol de administrador al usuario
        usuario.rol = 'admin';
    }
   
    res.setHeader('Content-Type','application/json')
    res.redirect('/productos')
//     res.status(200).json({
//         message:"Login correcto", usuario
//     })
})


router.get('/logout', (req, res) => {
    req.session.destroy(e => {
        if (e) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${e.message}`
            });
        } else {
            // Redirigir al usuario al inicio de sesión después del cierre de sesión
            res.redirect('/login');
        }
    });
});
