import { Router } from 'express';
import { UsuariosManagerDao } from '../dao/usuariosManagerDao.js';
import { creaHash, passportCall } from '../utils.js';
import passport from 'passport';
import SessionsController from '../controller/sessions.controller.js';

export const router = Router();

let usuariosManager = new UsuariosManagerDao();

router.get("/usuarios", async (req, res) => {
    let usuarios = await usuariosManager.getAll().populate("rol").lean();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ usuarios });
});

router.post("/registro", passportCall("registro"), (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(201).json({ status: "Registro correcto", usuario: req.user });
});

router.get("/errorLogin", (req, res) => {
    return res.status(400).json({ error: `Error al logearse` });
});

router.post('/login', passportCall("login"), (req, res) => {
    let usuario = req.user;
    if (!usuario) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Credenciales inválidas` });
    }

    // Asignar el rol de administrador si es necesario
    if (usuario.email === 'adminCoder@coder.com') {
        usuario.rol = 'admin';
    }

    // Eliminar la contraseña de la respuesta
    delete usuario.password;
    req.session.usuario = usuario;

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
        message: "Login correcto",
        usuario
    });
});

// Recuperación de Contraseña
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

export default router;
