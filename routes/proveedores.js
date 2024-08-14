import { Router } from 'express'

import { providerController, relationshipController } from '../controllers/proveedores.js'

const router = Router()

// Provider routes
router.post('/providers', providerController.create);
router.get('/providers', providerController.getAll);
router.get('/providers/:id', providerController.getOne);
router.put('/providers/:id', providerController.update);
router.delete('/providers/:id', providerController.delete);

// Relationship routes
router.post('/relationships', relationshipController.associateItemWithProvider);
router.delete('/relationships', relationshipController.disassociateItemFromProvider);
router.get('/items/:itemId/providers', relationshipController.getProvidersForItem);
router.get('/providers/:providerId/items', relationshipController.getItemsForProvider);

export default router