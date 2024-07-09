import { generarJWT } from "../middlewares/validar-jwt.js"
import sedes from "../models/sedes.js"
import Usuario from "../models/usuarios.js"
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken'
import { enviarCorreoRecuperacion } from '../helpers/email.js';

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
            const salt = bcryptjs.genSaltSync();
            usuario.password = bcryptjs.hashSync(password, salt);
            await usuario.save();
            res.json({ usuario });
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
        const { id } = req.params;
        const { password } = req.body;
    
        if (!password) {
          return res.status(400).json({ msg: "Password is required" });
        }
    
        try {
 
          const salt = bcryptjs.genSaltSync(10);
          const hashedPassword = bcryptjs.hashSync(password, salt);
    

          const usuario = await Usuario.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
          );
    
          if (!usuario) {
            return res.status(404).json({ msg: "User not found" });
          }
    
          res.json({ usuario });
        } catch (error) {
          console.error("Error actualizando password:", error);
          res.status(500).json({ msg: "error de servidor" });
        }
      },

    putUsuariosActivar: async (req, res) => {
        const { id } = req.params;
        try {
            const usuario = await Usuario.findByIdAndUpdate(id, { estado: 1 }, { new: true });
            if (!usuario) {
                return res.status(404).json({ error: "usuario no encontrado" });
            }
            res.json({ usuario });
        } catch (error) {
            console.error("Error al activar usuario", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
    
    putUsuariosDesactivar: async (req, res) => {
        const { id } = req.params;
        try {
            const usuario = await Usuario.findByIdAndUpdate(id, { estado: 0 }, { new: true });
            if (!usuario) {
                return res.status(404).json({ error: "usuario no encontrado" });
            }
            res.json({ usuario });
        } catch (error) {
            console.error("Error al desactivar usuario", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await Usuario.findOne({ email: email });

            if (!user || user.estado == 0) {
                return res.status(401).json({ msg: "usuario o contraseña incorrecto" });
            }

            const validacionpassword = bcryptjs.compareSync(password, user.password);
            if (!validacionpassword) {
                return res.status(401).json({ msg: "usuario o contraseña incorrecto" });
            }

            const token = await generarJWT(user._id, user.rol);
            res.json({ usuario: user, token });
        } catch (error) {
            return res.status(500).json({ msg: "comuniquese con el admin." });
        }
    },
    getemail: async (req, res) => {
        const { email } = req.query;
        try {
          const user = await Usuario.findOne({ email: email });
          if (!user || user.estado === 0) {
            return res.status(401).json({ msg: "Email incorrecto" });
          }
          const token = await generarJWT(user._id);
        res.json({ usuario: user, token });
          return res.status(200).json({ msg: "Email válido" });
        } catch (error) {
          return res.status(500).json({ msg: "Comuníquese con el admin." });
        }
      },
      recuperarPassword: async (req, res) => {
        const { email } = req.body;
        try {
          const user = await Usuario.findOne({ email });
          if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
          }
    
          const token = await generarJWT(user._id, user.rol);
          await enviarCorreoRecuperacion(email, token);
    
          res.json({ msg: 'Correo de recuperación enviado' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ msg: 'Error interno del servidor' });
        }
      },

}


export default httpUsuarios