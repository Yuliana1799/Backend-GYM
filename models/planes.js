import mongoose from "mongoose";

const planesSchema=new mongoose.Schema({
descripcion:{type:String,required:true},
valor:{ type: Number, require: true },
dias:{ type: String,required:true},
estado:{type:Number,default:1},

})

export default mongoose.model("Plan", planesSchema)  


