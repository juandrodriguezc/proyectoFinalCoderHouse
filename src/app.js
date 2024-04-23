import express from 'express';
import session from 'express-session';
import __dirname from "./utils.js"
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


const PORT=3000;
let io;
const app=express();


app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session(
    {
    secret:"coderhouse",
    resave:true,
    saveUninitialized:true,
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

const server=app.listen(PORT,()=>{//Server de Http
    console.log(`Server escuchando en puerto ${PORT}`);
});

io=new Server(server)//Server de WebSocket

io.on('connection', socket=>{
    console.log(`Se ha conectado un usuario con id ${socket.id}`)
})

const connect=async()=>{
    try {
        await mongoose.connect("mongodb+srv://rodriguezcolmenaresjuand:coderhouse@cluster0.2ufzjxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{dbName:"Ecommerce"})
        console.log("DB Online...!!!")
    } catch (error) {
        console.log("Fallo conexión. Detalle:", error.message)
    }
}
connect()