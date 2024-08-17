process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import 'dotenv/config'
import  express  from "express"
import dbConexion from "./database/cnxmongoose.js"
import clientes from "./routes/clientes.js"
import ingresos from "./routes/ingresos.js"
import inventario from "./routes/inventario.js"
import mantenimiento from "./routes/mantenimiento.js"
import maquinas from "./routes/maquinas.js"
import pagos from "./routes/pagos.js"
import planes from "./routes/planes.js"
import sedes from "./routes/sedes.js"
import usuarios from "./routes/usuarios.js"
import ventas from "./routes/ventas.js"
import proveedores from './routes/proveedores.js'
import interval from './routes/interval.js'

import cron from 'node-cron'
import cors from 'cors'

import { sendEmailItemsWithoutExpirationDateItems, sendEmailWhenExpirationItems } from './helpers/email.js'
import Inventario from "./models/inventario.js"
import Usuario from "./models/usuarios.js"

const app = express()
app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use("/api/clientes",clientes)
app.use("/api/ingresos",ingresos)
app.use("/api/inventario",inventario)
app.use("/api/mantenimiento",mantenimiento)
app.use("/api/maquinas",maquinas)
app.use("/api/pagos",pagos)
app.use("/api/planes",planes)
app.use("/api/sedes",sedes)
app.use("/api/usuarios",usuarios)
app.use("/api/ventas",ventas)
app.use("/api/proveedores",proveedores)
app.use("/api/interval",interval)

app.listen(process.env.PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
    dbConexion()
})

cron.schedule('*/20 * * * * *', async () => {
    const thirtyDaysFromNow = new Date();

    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expirationitems = await Inventario.find({ expirationDate: { $lte: thirtyDaysFromNow } })

    const itemsWithoutExpirationDate = await Inventario.find({ expirationDate: { $exists: false } })

    const adminUsers = await Usuario.find({
        rol: 'Administrador'
    })
    
    for (const admin of adminUsers) {
        await sendEmailItemsWithoutExpirationDateItems(admin.email, itemsWithoutExpirationDate)

        await sendEmailWhenExpirationItems(admin.email, expirationitems)
    }

})
