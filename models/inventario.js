import mongoose from "mongoose";

const inventarioSchema=new mongoose.Schema({
    codigo:{type:Number, require: true, unique:true},
    descripcion:{type:String,required:true},
    valor:{ type: Number, require: true },
    cantidad: { type: Number, require: true },
    estado: { type: Number, default: 1 },
    createAt: { type: Date, default: new Date() },
    expirationDate: { type: Date, default: new Date(), require: true },
    providers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Provider' }]
})

export default mongoose.model("Inventario",inventarioSchema)
