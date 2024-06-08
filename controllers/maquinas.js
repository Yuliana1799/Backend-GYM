import Maquina from "../models/maquinas.js"

const httpMaquinas = {

    getMaquinas: async (req, res) => {
        const {busqueda} = req.query
        const maquina = await Maquina.find(
            {
                $or: [
                    { descripcion: new RegExp(busqueda, "i") },
                ]
            }
        ).populate("idSede")
        res.json({maquina})
    },

    getMaquinasID: async (req, res) => {
        const { id } = req.params
        const maquina = await Maquina.findById(id).populate('idSede')
        res.json({ maquina })
    },

    getMaquinasactivados: async (req, res) => {
        const activados = await Maquina.find({estado: 1})
        res.json({ activados })
    },

    getMaquinasdesactivados: async (req, res) => {
        const desactivados = await Maquina.find({estado: 0})
        res.json({ desactivados })
    },
    postMaquinas: async (req, res) => {
        try {
        const {idSede,codigo,descripcion,estado} = req.body
        const maquina = new Maquina({idSede,codigo,descripcion,estado})
        await maquina.save()
        res.json({ maquina })
    }catch (error) {
        res.status(400).json({ error: "No se pudo crear el registro" })
    }
    },

    putMaquinas: async (req, res) => {
        const { id } = req.params
        const { _id,codigo,fechaIngreso, ...resto } = req.body
        console.log(resto);

        const maquina = await Maquina.findByIdAndUpdate(id, resto, { new: true })
        res.json({ maquina })
    },

    putMaquinasActivar: async (req, res) => {
        const { id } = req.params
        const maquina = await Maquina.findByIdAndUpdate(id, { estado: 1 }, { new: true })
        res.json({ maquina})
    },

   

    putMaquinasDesactivar: async (req, res) => {
        const { id } = req.params
        const maquina = await Maquina.findByIdAndUpdate(id, { estado: 0 }, { new: true })
        res.json({ maquina })
    }

}
export default httpMaquinas