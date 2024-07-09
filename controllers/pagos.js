import Pago from "../models/pagos.js"
import Plan from "../models/planes.js"
import Cliente from "../models/clientes.js"

const httpPagos = {

    getPagos: async (req, res) => {
        const {busqueda} = req.query
        const pago = await Pago.find().populate("idCliente").populate("idPlan")
        res.json({pago})
    },
    getPagosactivados: async (req, res) => {
        try {
            const activados = await Pago.find({ estado: 1 });
            res.json({ activados });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener Pago activados' });
        }
    },

    getPagosdesactivados: async (req, res) => {
        try {
        const desactivados = await Pago.find({ estado: 0 })
        res.json({ desactivados })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener Pago activados' });
    }
    },

    getPagosID: async (req, res) => {
        const { id } = req.params
        const pago = await Pago.findById(id).populate("idCliente").populate("idPlan")
        res.json({ pago })
    },

    postPagos: async (req, res) => {
        try {
          const { idCliente, idPlan, estado } = req.body;
    
          const plan = await Plan.findById(idPlan);
          if (!plan) {
            return res.status(404).json({ error: "Plan no encontrado" });
          }
    
          const valor = plan.valor;
          const dias = plan.dias;
    
          const fechaVencimiento = new Date();
          fechaVencimiento.setDate(fechaVencimiento.getDate() + dias);
    
          const pago = new Pago({ idCliente, idPlan, valor, estado });
          await pago.save();
    
          const cliente = await Cliente.findById(idCliente);
          if (!cliente) {
            return res.status(404).json({ error: "Cliente no encontrado" });
          }
          cliente.fechavencimiento = fechaVencimiento;
          await cliente.save();
    
          res.json({ pago, cliente });
        } catch (error) {
          console.error(error);
          res.status(400).json({ error: "No se pudo crear el registro", detalles: error.message });
        }
      },


    putPagos: async (req, res) => {
        const { id } = req.params
        const { _id, estado,  ...resto } = req.body
        console.log(resto);

        const pago = await Pago.findByIdAndUpdate(id, resto, { new: true })
        res.json({ pago })
    },

    putPagosActivar: async (req, res) => {
        const { id } = req.params;
        try {
            const pago = await Pago.findByIdAndUpdate(id, { estado: 1 }, { new: true });
            if (!pago) {
                return res.status(404).json({ error: "pago no encontrado" });
            }
            res.json({ pago });
        } catch (error) {
            console.error("Error al activar pago", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    putPagosDesactivar: async (req, res) => {
        const { id } = req.params;
        try {
            const pago = await Pago.findByIdAndUpdate(id, { estado: 0 }, { new: true });
            if (!pago) {
                return res.status(404).json({ error: "pago no encontrado" });
            }
            res.json({ pago });
        } catch (error) {
            console.error("Error al desactivar pago", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
}
export default httpPagos