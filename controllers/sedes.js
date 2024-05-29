import Sede from "../models/sedes.js"

const httpSedes = {

    getSedes: async (req, res) => {
        const {busqueda} = req.query
        const sede = await Sede.find()
        res.json({sede})
    },

    getSedesID: async (req, res) => {
        const { id } = req.params
        const sede = await Sede.findById(id)
        res.json({ sede })
    },
    getSedesactivados: async (req, res) => {
        const activados = await Sede.find(estado == 1)
        res.json({ activados })
    },

    getSedesdesactivados: async (req, res) => {
        const desactivados = await Sede.find(estado == 0)
        res.json({ desactivados })
    },

    postSedes: async (req, res) => {
        try {
          const { nombre, direccion, telefono, ciudad, horario, estado } = req.body;
          const sede = new Sede({ nombre, direccion, telefono, ciudad, horario, estado });
          await sede.save();
          res.json({ sede });
        } catch (error) {
          console.error("Error creating new sede:", error);
          res.status(400).json({ error: "No se pudo crear el registro" });
        }
      },

    putSedes: async (req, res) => {
        const { id } = req.params;
        const { _id, estado, ...resto } = req.body;
      
        try {
          const sede = await Sede.findByIdAndUpdate(id, resto, { new: true });
          res.json({ sede });
        } catch (error) {
          console.error("Error al actualizar la sede:", error);
          res.status(500).json({ msg: "Error al actualizar la sede" });
        }
      },

    putSedesActivar: async (req, res) => {
        const { id } = req.params
        const sede = await Sede.findByIdAndUpdate(id, { estado: 1 }, { new: true })
        res.json({ sede })
    },

    putSedesDesactivar: async (req, res) => {
        const { id } = req.params
        const sede = await Sede.findByIdAndUpdate(id, { estado: 0 }, { new: true })
        res.json({ sede })
    },
    deleteAllSedes: async (req, res) => {
      try {
          const result = await Sede.deleteMany({});
          res.json({ message: 'Todas las sedes han sido eliminadas correctamente' });
      } catch (error) {
          console.error('Error al borrar todas las sedes:', error);
          res.status(500).json({ error: 'No se pudieron borrar todas las sedes' });
      }

  }
}
export default httpSedes