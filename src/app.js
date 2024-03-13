import express from 'express';
import __dirname from "./utils.js"
import path from "path";
import { Server } from 'socket.io'
import handlebars from "express-handlebars"
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js'
import listadoRouter from './routes/listadoRouter.js'
const PORT=3000;

let serverSocket;
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")))

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use('/', listadoRouter )

const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});

serverSocket=new Server(server)