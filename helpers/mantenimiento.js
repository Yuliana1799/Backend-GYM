import Mantenimiento from "../models/mantenimiento.js"
import Maquina from "../models/maquinas.js"


const helpersMantenimiento={
    validarIdMaquina:async (idMaquina)=>{
        const existe = await Maquina.findById(idMaquina)
        if (existe==undefined){
            throw new Error ("Id no existe")
        }
    },
    validarIdMantenimiento:async (id)=>{
        const existe = await Mantenimiento.findById(id)
        if (existe==undefined){
            throw new Error ("Id no existe")
        }
    }
}

export default helpersMantenimiento