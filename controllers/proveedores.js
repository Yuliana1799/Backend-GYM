import { Provider, InventoryItemProvider } from '../models/proveedores.js'
import InventoryItem from '../models/inventario.js'

// Provider Controllers
export const providerController = {
    // Create
    async create(req, res) {
        try {
          const newProvider = new Provider(req.body);
          await newProvider.save();
          res.status(201).json(newProvider);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
    },

    // Read all
    async getAll(req, res) {
        try {
            const providers = await Provider.find();
            res.json(providers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Read one
    async getOne(req, res) {
        try {
            const provider = await Provider.findById(req.params.id);
            if (!provider) return res.status(404).json({ message: 'Provider not found' });
            res.json(provider);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update
    async update(req, res) {
        try {
            const updatedProvider = await Provider.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedProvider) return res.status(404).json({ message: 'Provider not found' });
            res.json(updatedProvider);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Delete
    async delete(req, res) {
        try {
        const deletedProvider = await Provider.findByIdAndDelete(req.params.id);
        if (!deletedProvider) return res.status(404).json({ message: 'Provider not found' });
        res.json({ message: 'Provider deleted successfully' });
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    }
};

// Relationship Controllers
export const relationshipController = {
    // Associate an inventory item with a provider
    async associateItemWithProvider(req, res) {
      try {
        const { itemId, providerId } = req.body;
        const newRelation = new InventoryItemProvider({
          inventoryItem: itemId,
          provider: providerId
        });
        await newRelation.save();
  
        // Update the InventoryItem and Provider documents
        await InventoryItem.findByIdAndUpdate(itemId, { $addToSet: { providers: providerId } });
        await Provider.findByIdAndUpdate(providerId, { $addToSet: { inventoryItems: itemId } });
  
        res.status(201).json(newRelation);
      } catch (error) {
        console.error(error)
        res.status(400).json({ message: error.message });
      }
    },
  
    // Disassociate an inventory item from a provider
    async disassociateItemFromProvider(req, res) {
      try {
        const { itemId, providerId } = req.query;
        // console.log('body', req.body)
        await InventoryItemProvider.findOneAndDelete({ inventoryItem: itemId, provider: providerId });
  
        // Update the InventoryItem and Provider documents
        await InventoryItem.findByIdAndUpdate(itemId, { $pull: { providers: providerId } });
        await Provider.findByIdAndUpdate(providerId, { $pull: { inventoryItems: itemId } });
  
        res.json({ message: 'Relationship removed successfully' });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    },
  
    // Get all providers for an inventory item
    async getProvidersForItem(req, res) {
      try {
        const item = await InventoryItem.findById(req.params.itemId).populate('providers');
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item.providers);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  
    // Get all inventory items for a provider
    async getItemsForProvider(req, res) {
      try {
        const provider = await Provider.findById(req.params.providerId).populate('inventoryItems');
        if (!provider) return res.status(404).json({ message: 'Provider not found' });
        res.json(provider.inventoryItems);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
};

