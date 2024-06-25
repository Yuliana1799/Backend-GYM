import jwt from 'jsonwebtoken';
import Usuario from "../models/usuarios.js";

const generarJWT = (uid, rol) => {
    return new Promise((resolve, reject) => {
        const payload = { uid, rol};
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: "100y"
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject("No se pudo generar el token")
            } else {
                resolve(token)
            }
        })
    })
}

const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");
    if (!token) {
        return res.status(401).json({
            msg: "No hay user en la peticion"
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        let usuario = await Usuario.findById(uid);


        if (!usuario) {
            return res.status(401).json({
                msg: "usuario o contraseña incorrecto11"
            })
        }

        if (usuario.estado == 0) {
            return res.status(401).json({
                msg: "usuario o contraseña incorrecto22"
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