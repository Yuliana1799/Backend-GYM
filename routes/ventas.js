

import { Router } from 'express';
import httpVentas from '../controllers/ventas.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import helpersVentas from '../helpers/ventas.js';
import { validarJWT } from '../middlewares/validar-jwt.js'

const router = Router();
// router.get("/listar", [validarJWT],httpVentas.getVentas)
router.get("/listar",[
    validarJWT,
  ], httpVentas.getVentas);

router.get("/listarid/:id", httpVentas.getVentasID);

router.post("/escribir", [
    check('valorUnitario', 'El valor unitario es obligatorio').notEmpty(),
    check('idProducto', 'Se necesita un MongoId válido').isMongoId(),
    check('idProducto').custom(helpersVentas.validarIdInventario),
    check('cantidad', 'La cantidad es obligatoria y debe ser numérica').isNumeric(),
    check('cantidad').custom((value, { req }) => helpersVentas.validarCantidadDisponible(req.body.idProducto, value)),
    validarCampos
], httpVentas.postVentas);

router.put("/modificar/:id", [  
    check('idProducto').custom(helpersVentas.validarIdInventario),
    check('valorUnitario','no puede estar vacío el valor unitario y debe ser en número.').notEmpty().isNumeric(),
    check('cantidad','no puede estar vacía la cantidad y debe ser en números.').notEmpty().isNumeric(),
    check("cantidad", 'no puede digitar una cantidad superior al máximo establecido').custom((value, { req }) => helpersVentas.validarCantidadDisponible(req.body.idProducto, value)),
    validarCampos
], httpVentas.putVentas);

export default router;
