import { usuariosModelo } from "./models/usuarios.modelo.js"
import { sendEmail } from "../utils.js";

export class UsuariosManagerDao{

    async getAll(filtro={}){
        return await usuariosModelo.find(filtro, { password: 0 }).lean();
    }

    async create(usuario){
        let nuevoUsuario=await usuariosModelo.create(usuario)
        return nuevoUsuario.toJSON()
    }

    async getBy(filtro={}){   // {email}
        return await usuariosModelo.findOne(filtro).lean()
    }
    
    async findUserByEmail(email) {
        return await usuariosModelo.findOne({ email });
    }

    async deleteOldUsers() {
        const dosDias = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Fecha y hora de hace dos días
    
        // Encontrar los usuarios que serán eliminados
        const usuariosInactivos = await usuariosModelo.find({ lastLogin: { $lt: dosDias } });
        console.log('Usuarios inactivos:', usuariosInactivos);
        // Enviar correos electrónicos a los usuarios inactivos
        usuariosInactivos.forEach(usuario => {
        const correo = usuario.email;
        const asunto = 'Cuenta eliminada por inactividad';
        const mensaje = `Hola ${usuario.username},\n\nTu cuenta ha sido eliminada debido a la inactividad durante los últimos 2 días. Si tienes alguna pregunta, por favor contacta con soporte.\n\nSaludos,\nEl equipo`;
    
        sendEmail(correo, asunto, mensaje).catch(err => console.error(`Error enviando correo a ${correo}:`, err));
        });

        return await usuariosModelo.deleteMany({ lastLogin: { $lt: dosDias } });
    };

    async updateUserPassword(email, newPassword) {
        const user = await usuariosModelo.findOne({ email });
        if (user) {
            user.password = newPassword;
            return await user.save();
        }
        return null;
    }

    async update(id, updates) {
        try {
            // Actualiza el usuario con el id especificado y los datos de actualización proporcionados
            const updatedUser = await usuariosModelo.findByIdAndUpdate(id, updates, { new: true });
            return updatedUser;
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            throw new Error('Error al actualizar el usuario');
        }
    }
}
