import {UsuariosManagerDao as UsuariosDao} from '../dao/usuariosManagerDao.js';
import jwt from 'jsonwebtoken';
import {sendEmail} from '../utils.js';
import { config } from '../config/config.js';

const usuariosDao = new UsuariosDao();

class SessionsController {
    static recupero01 = async (req, res) => {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'El Email es requerido' });
        }

        const user = await usuariosDao.findUserByEmail(email);

        if (!user) {
            return res.status(404).json({ error: 'El Usuario no fue encontrado' });
        }

        const token = jwt.sign({ email }, config.JWT_SECRET, { expiresIn: '1h' });
        const link = `http://localhost:3001/api/sessions/recupero02?token=${token}`;

        await sendEmail(email, 'Recuperación de contraseña', `Ingrese en el siguiente enlace para recuperar su contraseña: ${link}`);

        return res.status(200).json({ message: 'Revise su mail y siga los pasos.' });
    }

    static recupero02 = (req, res) => {
        const { token } = req.query;

        try {
            jwt.verify(token, config.JWT_SECRET);
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
        console.log('Token recibido:', token);

        try {
            const { email } = jwt.verify(token, config.JWT_SECRET);
            await usuariosDao.updateUserPassword(email, newPassword);
            return res.status(200).json({ message: 'Contraseña actualizada correctamente' });
        } catch (error) {
            console.error('Error en recupero03:', error);
            return res.status(400).json({ error: 'Token inválido o expirado' });
        }
    }
}

export default SessionsController;
