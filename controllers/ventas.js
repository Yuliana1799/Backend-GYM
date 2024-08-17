

import Venta from "../models/ventas.js";
import Inventario from "../models/inventario.js";
import helpersVentas from "../helpers/ventas.js"; 
import Contador from "../models/contador.js";

const obtenerSiguienteCodigo = async () => {
  const nombreContador = 'ventas';
  const contador = await Contador.findOneAndUpdate(
    { nombre: nombreContador },
    { $inc: { valor: 1 } },
    { new: true, upsert: true }
  );
  return contador.valor;
};
const httpVentas = {
    getVentas: async (req, res) => {
        const { busqueda } = req.query;
        const venta = await Venta.find(busqueda ? { descripcion: new RegExp(busqueda, "i") } : {})
                                 .populate("idProducto", "descripcion codigo");
        res.json({ venta });
    },

    getVentasID: async (req, res) => {
        const { id } = req.params;
        const venta = await Venta.findById(id).populate("idProducto");
        res.json({ venta });
    },

    getVentasporproducto :async (req, res) => {
        try {
            const { id } = req.params;
            const venta = await Venta.find({ idProducto: id }).populate("idProducto");
            res.json({ venta });
        } catch (error) {
            console.error("Error al obtener ventas por ID de producto:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    postVentas: async (req, res) => {
        try {
            const { valorUnitario, idProducto, cantidad } = req.body;

           
            await helpersVentas.validarIdProducto(idProducto);
            await helpersVentas.validarCantidadDisponible(idProducto, cantidad);

            const codigo = await obtenerSiguienteCodigo();
            const total = valorUnitario * cantidad;
            const venta = new Venta({ valorUnitario, idProducto, cantidad,codigo, total });

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
            const { valorUnitario, idProducto, cantidad } = req.body;

            await helpersVentas.validarIdProducto(idProducto);
            await helpersVentas.validarCantidadDisponible(idProducto, cantidad);

            const ventaOriginal = await Venta.findById(id);
            if (!ventaOriginal) {
                throw new Error("Venta no encontrada");
            }

            const diferencia = cantidad - ventaOriginal.cantidad;

            const ventaActualizada = await Venta.findByIdAndUpdate(id, { valorUnitario, idProducto, cantidad }, { new: true });

            await helpersVentas.ajustarInventario(idProducto, diferencia);

            res.json({ venta: ventaActualizada });
        } catch (error) {
            console.error("Error updating ventas:", error);
            res.status(400).json({ error: error.message || "No se pudo actualizar la venta" });
        }
    }
};

export default httpVentas;
