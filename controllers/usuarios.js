import { generarJWT } from "../middlewares/validar-jwt.js"
import sedes from "../models/sedes.js"
import Usuario from "../models/usuarios.js"
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken'
const httpUsuarios = {

    getUsuarios: async (req, res) => {
        const { busqueda } = req.query
        const usuario = await Usuario.find(
            {
                $or: [
                    { nombre: new RegExp(busqueda, "i") },

                ]
            }
        ).populate("idSede")
        res.json({ usuario })
    },

    getUsuariosID: async (req, res) => {
        const { id } = req.params;
        try {
            const usuario = await Usuario.findById(id).populate('idSede');
            res.json({ usuario });
        } catch (error) {
            console.error("Error fetching usuario by ID:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },


    getUsuariosactivados: async (req, res) => {
        const activados = await Usuario.find({ estado: 1 }).populate("idSede")
        res.json({ activados })
    },

    getUsuariosdesactivados: async (req, res) => {
        const desactivados = await Usuario.find({ estado: 0 }).populate("idSede")
        res.json({ desactivados })
    },

    postUsuarios: async (req, res) => {
        try {
            const { nombre, email, telefono, idSede, password, rol, estado } = req.body
            console.log(idSede, " ", nombre);
            const usuario = new Usuario({ nombre, email, telefono, idSede, password, rol, estado })
            await usuario.save()
            res.json({ usuario })
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: "No se pudo crear el registro" })
        }
    },

    putUsuarios: async (req, res) => {
        const { id } = req.params
        const { _id, estado, password, ...resto } = req.body
        console.log(resto);

        const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true })
        res.json({ usuario })
    },

    putUsuariospassword: async (req, res) => {
        const { id } = req.params
        const { password } = req.body
        console.log(password);

        const usuario = await Usuario.findByIdAndUpdate(id, { password }, { new: true })
        res.json({ usuario })
    },

    putUsuariosActivar: async (req, res) => {
        const { id } = req.params
        const usuario = await Usuario.findByIdAndUpdate(id, { estado: 1 }, { new: true })
        res.json({ usuario })
    },

    putUsuariosDesactivar: async (req, res) => {
        const { id } = req.params
        const usuario = await Usuario.findByIdAndUpdate(id, { estado: 0 }, { new: true })
        res.json({ usuario })
    },

    login: async (req, res) => {
    const { email, password } = req.body;
    console.log('Received email:', email);
    console.log('Received password:', password);
    
    try {
        const user = await Usuario.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(401).json({
                msg: "usuario o contraseña incorrecto00"
            });
        }

        if (user.estado === 0) {
            console.log('User is inactive');
            return res.status(401).json({
                msg: "usuario o contraseña incorrecto11"
            });
        }

        console.log("busqueda "+user.password)
        console.log("frontend "+ password);
        console.log( await bcryptjs.compare(password, user.password));
        /* const validacionpassword = await bcryptjs.compare(password, user.password); */
        if (password!==user.password) {
            return res.status(401).json({
                msg: "usuario o contraseña incorrecto22"
            });
        }

        const token = await generarJWT(user._id, user.rol);
        res.json({
            usuario: user,
            token
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            msg: "comuniquese con el admin."
        });
    }
}

}


export default httpUsuarios