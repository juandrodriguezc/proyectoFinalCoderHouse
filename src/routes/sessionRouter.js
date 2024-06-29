import { Router } from 'express';
import { UsuariosManagerDao } from '../dao/usuariosManagerDao.js';
import { creaHash, passportCall } from '../utils.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'
import SessionsController from '../controller/sessions.controller.js';

export const router=Router()



let usuariosManager=new UsuariosManagerDao()

router.get("/usuarios", async(req, res)=>{
    let usuarios=await usuarioModelo.find().populate("rol").lean()

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({usuarios});
})

router.post("/registro", passportCall("registro"), (req, res)=>{

    res.setHeader('Content-Type','application/json');
    return res.status(201).json({status:"registro correcto", usuario:req.user});
})


router.get("/errorLogin", (req, res)=>{
    return res.status(400).json({error:`Error al logearse`})
})


router.post('/login',async(req,res)=>{

    let {email, password} =req.body
    if(!email || !password){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Faltan datos`})
    }


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

//Recuperacion de Contraseña

router.post('/recupero01', SessionsController.recupero01);
router.get('/recupero02', SessionsController.recupero02);
router.post('/recupero03', SessionsController.recupero03);



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
