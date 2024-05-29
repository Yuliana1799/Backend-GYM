import Venta from "../models/ventas.js"
import Inventario from "../models/inventario.js"


const httpVentas = {

    getVentas: async (req, res) => {
        const {busqueda} = req.query
        const venta = await Venta.find()
        .populate("idProducto")
        res.json({venta})
    },

    getVentasID: async (req, res) => {
        const { id } = req.params
        const venta = await Venta.findById(id)
        res.json({ venta })
    },

    // postVentas: async (req, res) => {
    //     try {
    //       const { IdInventario, codigo, valorUnitario, cantidad } = req.body;
    //       const total = valorUnitario * cantidad; 
      
    //       const venta = new Cliente({ IdInventario, codigo, valorUnitario, cantidad, total });
    //       await venta.save();
    //       res.json({ venta });
    //     } catch (error) {
    //       res.status(400).json({ error: "No se pudo crear el registro" });
    //     }
    //   },

    postVentas: async (req, res) => {;
        try {
          const { id, valorUnitario, idProducto, cantidad } = req.body;
          const total = valorUnitario * cantidad;
      
          const venta = new Venta({ id, valorUnitario, idProducto, cantidad, total });
          await venta.save();
      
          const inventario = await Inventario.findById(id);
          inventario.cantidad -= cantidad;
          await inventario.save();
      
          res.json({ venta });
        } catch (error) {
          console.log(error);
          
          res.status(400).json({ error: error.message || "No se pudo crear el registro" });
        }
      },

      putVentas: async (req, res) => {
        console.log("ID de la venta recibido en el backend:", id);
        console.log("Datos recibidos en el backend:", res);
        try {
          const { id } = req.params;
          console.log("id ",id);

          const { ...resto } = req.body;
          console.log("resto",resto);

    
          const venta = await Venta.findByIdAndUpdate(id, resto, { new: true });
          res.json({ venta });
        } catch (error) {
          console.error("Error updating ventas:", error);
          res.status(400).json({ error: error.message || "No se pudo actualizar la venta" });
        }
      },
    };
export default httpVentas