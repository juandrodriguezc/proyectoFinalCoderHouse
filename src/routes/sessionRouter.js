import { Router } from 'express';
import { UsuariosManagerDao } from '../dao/usuariosManagerDao.js';
import { creaHash } from '../utils.js';
export const router=Router()

let usuariosManager=new UsuariosManagerDao()

router.post('/registro',async(req,res)=>{

    let {nombre, email, password} =req.body
    if(!nombre || !email || !password){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Faltan datos`})
    }

    let existe=await usuariosManager.getBy({email})
    if(existe){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ya existen usuarios con email ${email}`})

    }
    password=creaHash(password)

    try {
        let nuevoUsuario=await usuariosManager.create({nombre, email, password})

        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"Registro exitoso", nuevoUsuario});

    } catch (error) {
        return res.status(500).json({error: `Error inesperado`})
        
    }


})

router.post('/login',async(req,res)=>{

    let {email, password} =req.body
    if(!email || !password){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Faltan datos`})
    }

    let usuario=await usuariosManager.getBy({email})
    if(!usuario){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Correo incorrecto`})
    }

    if(usuario.password!==creaHash(password)){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Contraseña incorrecta`})
    }

    usuario={...usuario}
    delete usuario.password
    req.session.usuario=usuario // en un punto de mi proyecto

    res.setHeader('Content-Type','application/json')
    res.status(200).json({
        message:"Login correcto", usuario
    })
})


router.get('/logout',(req,res)=>{

    req.session.destroy(e=>{
        if(e){
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle:`${e.message}`
                }
            )
            
        }
    })
    
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        message:"Logout exitoso"
    });
});

export default router;