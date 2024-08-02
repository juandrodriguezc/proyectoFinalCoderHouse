import passport from "passport";
import local from "passport-local";
import { creaHash, validaPassword} from "../utils.js";
import { UsuariosManagerDao } from "../dao/usuariosManagerDao.js";
import { CartManager as CartDao } from "../dao/cartManagerDao.js";
import passportJWT from 'passport-jwt';
import { config } from "./config.js";

const usuariosManager = new UsuariosManagerDao();
const carritoManager = new CartDao();

const buscarToken = (req) => {
    let token = null;
    if (req.cookies.coderCookie) {
        token = req.cookies.coderCookie;
    }
    return token;
};

export const initPassport = () => {
    passport.use(
        "registro",
        new local.Strategy(
            {
                usernameField: "email",
                passReqToCallback: true
            },
            async (req, username, password, done) => {
                try {
                    let { nombre, rol } = req.body;
                    if (!nombre) {
                        return done(null, false, { message: "Complete el nombre..." });
                    }

                    let existe = await usuariosManager.getBy({ email: username });
                    if (existe) {
                        return done(null, false, { message: `Ya existe un usuario con email ${username} en BD...!!!` });
                    }

                    password = creaHash(password);

                    let nuevoCarrito = await carritoManager.createCart();
                    let nuevoUsuario = await usuariosManager.create({
                        nombre,
                        email: username,
                        password,
                        rol,
                        carrito: nuevoCarrito._id,
                        lastLogin: new Date()
                    });
                    delete nuevoUsuario.password;  // eliminar info confidencial
                    return done(null, nuevoUsuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField: "email"
            },
            async (username, password, done) => {
                try {
                    console.log({ username });
                    let usuario = await usuariosManager.getBy({ email: username });
                    if (!usuario) {
                        return done(null, false);
                    }

                    if (!validaPassword(password, usuario.password)) {
                        return done(null, false, { message: "Credenciales invalidas" });
                    }
                    delete usuario.password;

                    return done(null, usuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        "current",
        new passportJWT.Strategy(
            {
                secretOrKey: config.SECRET,
                jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([buscarToken])
            },
            async (usuario, done) => {
                try {
                    return done(null, usuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.serializeUser((usuario, done) => {
        return done(null, usuario._id);
    });

    passport.deserializeUser(async (id, done) => {
        let usuario = await usuariosManager.getBy({ _id: id });
        return done(null, usuario);
    });
};
