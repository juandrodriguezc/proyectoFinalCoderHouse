import {fileURLToPath} from 'url';
import { dirname, join } from 'path';
import crypto from "crypto"
import bcrypt from 'bcrypt'
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const rutaProductos=join(__dirname, "data", "productos.json")
export const rutaCarrito=join(__dirname, "data", "carts.json")
const SECRET="coderhouse"
export const creaHash=password=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validaPassword=(usuario, password)=>bcrypt.compareSync(password, usuario.password)

export const passportCall = (estrategia) => {
    return function(req, res, next) {
        passport.authenticate(estrategia, function(err, user, info, status) {
            if (err) { 
                return next(err); // Devolver el error al middleware de manejo de errores
            }
            if (!user) {
                res.setHeader('Content-Type','application/json');
                return res.status(401).json({
                    error: info && info.message ? info.message : 'Error de autenticación'
                });
            }
            req.user = user;
            return next();
        })(req, res, next);
    };
};