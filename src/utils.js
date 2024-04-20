import {fileURLToPath} from 'url';
import { dirname, join } from 'path';
import crypto from "crypto"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const rutaProductos=join(__dirname, "data", "productos.json")
export const rutaCarrito=join(__dirname, "data", "carts.json")
const SECRET="CoderCoder123"
export const creaHash=password=>crypto.createHmac("sha256",SECRET).update(password).digest("hex")

