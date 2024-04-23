import {fileURLToPath} from 'url';
import { dirname, join } from 'path';
import crypto from "crypto"
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const rutaProductos=join(__dirname, "data", "productos.json")
export const rutaCarrito=join(__dirname, "data", "carts.json")
const SECRET="coderhouse"
export const creaHash=password=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validaPassword=(usuario, password)=>bcrypt.compareSync(password, usuario.password)

