// const jwt = require('jsonwebtoken');
// const Usuario= require("../models/usuarios.js")


import jwt from 'jsonwebtoken';
import Usuario from "../models/usuarios.js";

const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid};
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: "4h"
        }, (err, token) => {
            if (err) {
                reject("No se pudo generar el token")
            } else {
                resolve(token)
            }
        })
    })
}

const validarJWT = async (req, res, next) => {
    const user = req.header("x-user");
    if (!user) {
        return res.status(401).json({
            msg: "No hay user en la peticion"
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        let usuario = await Usuario.findById(uid);


        if (!usuario) {
            return res.status(401).json({
                msg: "usuario o contraseña incorrecto"
            })
        }

        if (usuario.estado == 0) {
            return res.status(401).json({
                msg: "usuario o contraseña incorrecto"
            })
        }

        req.usuariobdtoken = usuario

        next();

    } catch (error) {


        res.status(401).json({
            msg: "Token no valido"
        })
    }
}


export { generarJWT, validarJWT }