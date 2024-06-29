import {fileURLToPath} from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcrypt'
import passport from 'passport';
import { faker } from '@faker-js/faker';
import winston from 'winston';
import { config } from './config/config.js';
import nodemailer from 'nodemailer';



//dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;
//rutas
export const rutaProductos=join(__dirname, "data", "productos.json")
export const rutaCarrito=join(__dirname, "data", "carts.json")

//passwords
export const creaHash=password=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validaPassword=(usuario, password)=>bcrypt.compareSync(password, usuario.password)
//passport
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

//Enviar mail

export const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.EMAIL,
            pass: config.EMAILPASSWORD
        }
    });

    const mailOptions = {
        from: config.EMAIL,
        to,
        subject,
        text
    };

    await transporter.sendMail(mailOptions);
};

//faker

faker.location= 'es';

export const generateProducts=()=>{
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        id: faker.database.mongodbObjectId()
    }
}

const customLevels={
    debug:0,
    http:1, 
    info:2, 
    warning:3,
    error:4,
    fatal:5
}
//Winston
export const logger=winston.createLogger(
    {
        levels: customLevels,
        transports:[
            new winston.transports.File({
                level: "debug",
                filename: "./src/logs/error.log",
                format: winston.format.combine(
                    winston.format.timestamp(),
                    // winston.format.colorize({
                    //     colors:{grave:"red", medio:"yellow", info:"blue", leve: "green"}
                    // }),
                    winston.format.json()
                )
            })
        ]
    }
)


const transporteFile=new winston.transports.File({
    level: "debug",
    filename: "./src/logs/erroresGraves.log",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    )
})

const transporteConsola=new winston.transports.Console(
    {
        level: "info", 
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize({
                colors:{debug:"red", http:"yellow", info:"blue", warning: "green", error: "white", fatal: "magenta"}
            }),
            winston.format.simple()
        )
    }
)

if(config.MODE!="production"){
    logger.add(transporteConsola)
}


export const middLogg=(req, res, next)=>{
    req.logger=logger
    next()
}