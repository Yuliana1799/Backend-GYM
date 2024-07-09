import mongoose from "mongoose";

const ventasSchema = new mongoose.Schema({
  idProducto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inventario",
    required: true,
  },
  fecha: { type: Date, default: Date.now() },
  valorUnitario: { type: Number, require: true },
  cantidad: { type: Number, require: true },
  total: { type: Number, default: "" },
  codigo: { type: Number, unique: true, required: true },

});

export default mongoose.model("Venta", ventasSchema);
