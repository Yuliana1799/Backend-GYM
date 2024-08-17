import Inventario from "../models/inventario.js"
import Proveedor from "../models/proveedores.js"


const helpersInventarios={
    validarExistaId:async (id)=>{
        const existe = await Inventario.findById(id)
        if (existe==undefined){
            throw new Error ("Id no existe")
        }
    },
    validaridProveedor:async (idProveedor)=>{
        const existe = await Proveedor.findById(idProveedor)
        if (existe==undefined){
            throw new Error ("Id no existe")
        }
    },
}

export default helpersInventarios