

import Venta from "../models/ventas.js";
import Inventario from "../models/inventario.js";
import helpersVentas from "../helpers/ventas.js"; 
const httpVentas = {
    getVentas: async (req, res) => {
        const { busqueda } = req.query;
        const venta = await Venta.find().populate("idProducto");
        res.json({ venta });
    },

    getVentasID: async (req, res) => {
        const { id } = req.params;
        const venta = await Venta.findById(id).populate("idProducto");
        res.json({ venta });
    },

    postVentas: async (req, res) => {
        try {
            const { valorUnitario, idProducto, cantidad } = req.body;

           
            await helpersVentas.validarIdInventario(idProducto);
            await helpersVentas.validarCantidadDisponible(idProducto, cantidad);

            const total = valorUnitario * cantidad;
            const venta = new Venta({ valorUnitario, idProducto, cantidad, total });
            await venta.save();

            const inventario = await Inventario.findById(idProducto);
            inventario.cantidad -= cantidad;
            await inventario.save();

            res.json({ venta });
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.message || "No se pudo crear el registro" });
        }
    },

    putVentas: async (req, res) => {
        try {
            const { id } = req.params;
            const { ...resto } = req.body;

            const venta = await Venta.findByIdAndUpdate(id, resto, { new: true });
            res.json({ venta });
        } catch (error) {
            console.error("Error updating ventas:", error);
            res.status(400).json({ error: error.message || "No se pudo actualizar la venta" });
        }
    },
};

export default httpVentas;
