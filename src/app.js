import express from 'express';
import session from 'express-session';
import __dirname, { logger, middLogg } from "./utils.js"
import path from "path";
import { Server } from 'socket.io'
import handlebars from "express-handlebars"
import {router as productsRouter} from './routes/productsRouter.js';
import {router as listadoRouter} from './routes/listadoRouter.js';
import mongoose from 'mongoose';
import {router as cartsRouter} from './routes/cartsRouter.js';
import {router as sessionRouter} from './routes/sessionRouter.js';
import passport from 'passport';
import { initPassport } from './config/passport.config.js';
import {router as usuariosRouter} from './routes/usuariosRouter.js'
import { router as mokingRouter } from './routes/productosMokingRouter.js';
import { config } from './config/config.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express'
import cookieParser from 'cookie-parser';



const PORT=config.PORT;
let io;
const app=express();
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "ABM / Usuarios",
            version: "1.0.0",
            description: "Documentación del proyecto ABM Usuarios"
        },
    },
    apis: [`${__dirname}/docs/*.yaml`]
}
const spec = swaggerJsdoc(options)

app.use(cookieParser());

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))

app.use(middLogg)
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec))
app.use(session(
    {
    secret:config.SECRET,
    resave:true,
    saveUninitialized:true,
    cookie:{secure:false}
    })

)
initPassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, "./public")))

app.use("/api/productos", (req, res, next)=>{
    req.io=io
    next()}, productsRouter);
app.use("/api/carts",
(req, res, next)=>{req.io=io
next()}, cartsRouter);
app.use('/', listadoRouter )
app.use('/api/sessions', sessionRouter)
app.use('/api/usuarios', usuariosRouter)
app.use('/api/mokingproducts', mokingRouter)

const server=app.listen(PORT,()=>{//Server de Http
    logger.info(`Server escuchando en puerto ${PORT}`);
});

io=new Server(server)//Server de WebSocket

io.on('connection', socket=>{
    logger.info(`Se ha conectado un usuario con id ${socket.id}`)
})

const connect=async()=>{
    try {
        await mongoose.connect(config.MONGO_URL,{dbName:config.DB_NAME})
        logger.info("DB Online...!!!")
    } catch (error) {
        logger.debug("Fallo conexión. Detalle:", error.message)
    }
}
connect()