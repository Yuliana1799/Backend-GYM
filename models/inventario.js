import mongoose from "mongoose";

const inventarioSchema=new mongoose.Schema({
 codigo:{type:Number, require: true, unique:true},
 descripcion:{type:String,required:true},
 valor:{ type: Number, require: true },
 cantidad: { type: Number, require: true },

})

export default mongoose.model("Inventario",inventarioSchema)
