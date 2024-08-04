import { Router } from 'express';
import UsuariosController from '../controller/usuarios.controller.js';
export const router=Router()

router.get('/', UsuariosController.getUsuarios)
router.get('/:id', UsuariosController.getUsuariosById)
router.post('/', UsuariosController.create)
router.put('/:id', UsuariosController.obtener)
router.delete('/inactivos', UsuariosController.deleteOldUsers);