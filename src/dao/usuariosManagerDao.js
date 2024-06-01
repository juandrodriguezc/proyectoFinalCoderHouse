import { usuariosModelo } from "./models/usuarios.modelo.js"

export class UsuariosManagerDao{

    async getAll(filtro={}){
        return await usuariosModelo.find(filtro).lean()
    }

    async create(usuario){
        let nuevoUsuario=await usuariosModelo.create(usuario)
        return nuevoUsuario.toJSON()
    }

    async getBy(filtro={}){   // {email}
        return await usuariosModelo.findOne(filtro).lean()
    }

}