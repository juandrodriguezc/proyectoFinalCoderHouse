import { isValidObjectId } from "mongoose";
import { UsuariosManagerDao as UsuariosDao } from "../dao/usuariosManagerDao.js";


const usuariosDao=new UsuariosDao()

export default class UsuariosController{
    static getUsuarios=async(req, res)=>{
        let usuarios=await usuariosDao.getAll()

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({usuarios});
    }

    static getUsuariosById=async(req, res)=>{
        let {id}=req.params
        if(!isValidObjectId(id)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ingrese un id válido`})
        }

        let usuario=await usuariosDao.getBy({_id:id})

        res.setHeader('Content-Type','application/json')
        res.status(200).json({usuario})
    }

    static create=async(req,res)=>{
        let{nombre, email}=req.body
        if(!email){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`email es requerido`})
        }

        let existe
        try {
            existe = await usuariosDao.getBy({email})
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle:`${error.message}`
                }
            )
        }
        if(existe){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ya existe un usuarios con email ${email}`})
        }

        try {
            let nuevoUsuario=await usuariosDao.create({nombre, email})
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({nuevoUsuario});            
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle:`${error.message}`
                }
            )
        }
    }
    }