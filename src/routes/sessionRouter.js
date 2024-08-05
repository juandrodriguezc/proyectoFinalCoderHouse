import { Router } from 'express';
import { UsuariosManagerDao } from '../dao/usuariosManagerDao.js';
import { creaHash, passportCall } from '../utils.js';
import passport from 'passport';
import SessionsController from '../controller/sessions.controller.js';
import jwt from 'jsonwebtoken'
import { config } from '../config/config.js';

export const router = Router();

let usuariosManager = new UsuariosManagerDao();

router.get("/usuarios", SessionsController.getUsuarios);

router.post("/registro", passportCall("registro"), (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(201).json({ status: "Registro correcto", usuario: req.user });
});

router.get("/errorLogin", (req, res) => {
    return res.status(400).json({ error: `Error al logearse` });
});

router.post('/login', passportCall("login"), async (req, res) => {
    let token=jwt.sign(req.user, config.SECRET, {expiresIn:"1h"})
    res.cookie("coderCookie", token)

    let {email, password} =req.body
    if(!email || !password){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Faltan datos`})
    }


    let usuario=req.user.usuario
    console.log(usuario)
    usuario={...usuario}
    delete usuario.password
    req.session.usuario=usuario

    if (usuario.email === 'adminCoder@coder.com') {
        usuario.rol = 'admin';
        // Actualizar el rol en la base de datos
        await usuariosManager.update({ _id: usuario._id }, { rol: 'admin' });
    }

    // res.setHeader('Content-Type','application/json')
    // res.redirect('/productos')
    res.status(200).json({
        message:"Login correcto", usuario
    })
})

// Recuperación de Contraseña
router.post('/recupero01', SessionsController.recupero01);
router.get('/recupero02', SessionsController.recupero02);
router.post('/recupero03', SessionsController.recupero03);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Usuario no autenticado' });
}
router.get('/session-status', ensureAuthenticated, (req, res) => {
    res.json({ isAuthenticated: true, user: req.user });
});
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

export default router;
