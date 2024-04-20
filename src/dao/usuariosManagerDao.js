import { usuariosModelo } from "./models/usuarios.modelo.js"

export class UsuariosManagerDao{

    async create(usuario){
        let nuevoUsuario=await usuariosModelo.create(usuario)
        return nuevoUsuario.toJSON()
    }

    async getBy(filtro){   // {email}
        return await usuariosModelo.findOne(filtro).lean()
    }

}