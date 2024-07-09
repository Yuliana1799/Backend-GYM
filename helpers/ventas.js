


import Venta from "../models/ventas.js";
import Inventario from "../models/inventario.js";

const helpersVentas = {
    validarIdProducto: async (idProducto) => {
        const existe = await Inventario.findById(idProducto);
        if (!existe) {
            throw new Error("Producto no existe");
        }
    },
    validarIdVentas: async (id) => {
        const existe = await Venta.findById(id);
        if (!existe) {
            throw new Error("Id no existe");
        }
    },
    validarCantidadDisponible: async (idProducto, cantidad) => {
        try {
            const inventario = await Inventario.findById(idProducto);
            if (!inventario) {
                throw new Error("Producto no encontrado");
            }
            if (cantidad > inventario.cantidad) {
                throw new Error("Cantidad excede la disponible en inventario");
            }
            return true;
        } catch (error) {
            throw error;
        }
    }
}
export default helpersVentas;
