import Usuario from "../models/usuarios.js"
import Sede from "../models/sedes.js"


const helpersUsuarios={
    validarIdSede:async (idSede)=>{
        const existe = await Sede.findById(idSede)
        console.log(idSede);
        if (existe==undefined){
            throw new Error ("Id no existe1")
        }
    },
    validarIdUsuario:async (id)=>{
        const existe = await Usuario.findById(id)
        if (existe==undefined){
            throw new Error ("Id no existe2")
        }
    },

    validarEmail: async (email) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    reject(new Error("El correo electrónico no es válido"));
                } else {
                    resolve();
                }
            }, 1); 
        });
    },
    
    validarPassword: async (password) => {
        const letras = password.replace(/[^a-zA-Z]/g, '').length;
        const numeros = password.replace(/\D/g, '').length;
    
        if (letras < 3 || numeros < 3) {
            throw new Error("La contraseña debe contener al menos tres letras y tres números");
        }
    },
    Noexisteelcorreo: async (email) => {
        if (email) {
            const existe = await Usuario.findOne({ email: email });
            if (!existe) throw new Error("El correo electrónico no es válido");
        }
    },
    emailExisteExceptoPropio: async (email, id) => {
        const existe = await Usuario.findOne({ email, _id: { $ne: id } });
        if (existe) {
            throw new Error("El correo electrónico ya está registrado por otro usuario");
        }
    },

    emailExiste: async (email) => {
        const existe = await Usuario.findOne({ email });
        if (existe) {
            throw new Error("El correo electrónico ya está registrado");
        }
    },    
}
export default helpersUsuarios