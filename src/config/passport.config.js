import passport from "passport";
import local from "passport-local"
import github from "passport-github"
import { creaHash, validaPassword } from "../utils.js";
import { UsuariosManagerDao } from "../dao/usuariosManagerDao.js";

const usuariosManager=new UsuariosManagerDao()
export const initPassport=()=>{

    passport.use(
        "registro",
        new local.Strategy(
            {
                usernameField:"email", 
                passReqToCallback: true
            },

            async function(req, username, password, done){
                try {
                    let {nombre, email} =req.body
                    if(!nombre || !email){

                        return done(null, false)
                    }
                
                    let existe=await usuariosManager.getBy({email})
                    if(existe){
                        
                        return done(null, false)
                    }
                
                    password=creaHash(password)
                
                    let nuevoUsuario=await usuariosManager.create({nombre, email, password})
            
                    
                    return done(null, nuevoUsuario)

                                    
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField: "email"
            },
            async (username, password, done)=>{
                try {
                    console.log({username})
                    let usuario=await usuariosManager.getBy({email:username})
                    if(!usuario){
                        return done(null, false)
                    }
                
                    if(!validaPassword(usuario, password)){
                        return done(null, false)
                    }
                
                    return done(null, usuario)
                                    
                } catch (error) {
                    return done(error)
                }
            }
        )
    ) 

    passport.serializeUser((usuario, done)=>{
        return done(null, usuario._id)
    })

    passport.deserializeUser(async (id, done)=>{
        let usuario=await usuariosManager.getBy({_id:id})
        return done(null, usuario)
    })
}