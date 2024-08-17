import Cliente from "../models/clientes.js"
import Plan from "../models/planes.js"



const helpersClientes={
    validarExistaIdcliente:async (id)=>{
        const existe = await Cliente.findById(id)
        if (existe==undefined){
            throw new Error ("Id no existe")
        }
    },
    validaridPlan:async (idPlan)=>{
        const existe = await Plan.findById(idPlan)
        if (existe==undefined){
            throw new Error ("Id no existe")
        }
    },
    validarDocumentoUnico: async (documento) => {
        const existe = await Cliente.findOne({ documento });
        if (existe) {
            throw new Error("El documento ya está registrado");
        }
    },
    
    documentoExisteExceptoPropio: async (documento, id) => {
        const existe = await Cliente.findOne({ documento, _id: { $ne: id } });
        if (existe) {
            throw new Error("El documento ya está registrado");
        }},
}

export default helpersClientes