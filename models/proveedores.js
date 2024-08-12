import mongoose from "mongoose";

// Provider Schema
const ProviderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    NIT: { type: String, required: true, unique: true },
    createdDate: { type: Date, default: Date.now },
    phone: { type: String },
    isActive: { type: Boolean, default: true },
    inventoryItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventario' }]
});

// Intermediate Schema for Many-to-Many relationship
const InventoryItemProviderSchema = new mongoose.Schema({
    inventoryItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventario', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    supplyDate: { type: Date, default: Date.now }
});

// Create indexes for better query performance
InventoryItemProviderSchema.index({ inventoryItem: 1, provider: 1 }, { unique: true });

export const Provider = mongoose.model('Provider', ProviderSchema);

export const InventoryItemProvider = mongoose.model('InventoryItemProvider', InventoryItemProviderSchema);