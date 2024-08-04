import {UsuariosManagerDao as UsuariosDao} from '../dao/usuariosManagerDao.js';
import jwt from 'jsonwebtoken';
import {creaHash, sendEmail} from '../utils.js';
import { config } from '../config/config.js';
import { UsuariosManagerDao } from '../dao/usuariosManagerDao.js';


const usuariosDao = new UsuariosDao();
let usuariosManager = new UsuariosManagerDao();
class SessionsController {

    static getUsuarios = async (req, res) => {
            let usuarios = await usuariosManager.getAll();
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ usuarios });
        }

    static recupero01 = async (req, res) => {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'El Email es requerido' });
        }

        const user = await usuariosDao.findUserByEmail(email);

        if (!user) {
            return res.status(404).json({ error: 'El Usuario no fue encontrado' });
        }

        const token = jwt.sign({ email }, config.SECRET, { expiresIn: '2h' });
        const link = `http://localhost:3001/api/sessions/recupero02?token=${token}`;

        await sendEmail(email, 'Recuperación de contraseña', `Ingrese en el siguiente enlace para recuperar su contraseña: ${link}`);

        return res.status(200).json({ message: 'Revise su mail y siga los pasos.' });
    }

    static recupero02 = (req, res) => {
        const { token } = req.query;

        try {
            jwt.verify(token, config.SECRET);
            return res.status(200).render('recuperacion2', { token });
        } catch (error) {
            return res.status(400).json({ error: 'Token inválido o expirado' });
        }
    }

    static recupero03 = async (req, res) => {
        const { token, newPassword } = req.body;
    
        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token y nueva contraseña son requeridos' });
        }
    
        try {
            const { email } = jwt.verify(token, config.SECRET); // Asegúrate de usar el secreto correcto
    
            // Hash de la nueva contraseña
            const hashedPassword = creaHash(newPassword);
    
            // Actualiza la contraseña en la base de datos
            await usuariosDao.updateUserPassword(email, hashedPassword);
    
            return res.status(200).json({ message: 'Contraseña actualizada correctamente' });
        } catch (error) {
            console.error('Error en recupero03:', error);
            return res.status(400).json({ error: 'Token inválido o expirado' });
        }
    }}
export default SessionsController;
