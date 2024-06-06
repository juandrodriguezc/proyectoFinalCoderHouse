import { Router } from 'express';
import { generateProducts } from '../utils.js';

export const router=Router()

router.get('/',(req,res)=>{
    let productos= []
    for(let i=0; i<100; i++){
        productos.push(generateProducts())
    }
    res.send({payload:productos})
})