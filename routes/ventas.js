import {Router} from 'express'
import httpVentas from '../controllers/ventas.js'
import { check, checkExact } from 'express-validator'
import { validarCampos } from '../middlewares/validar-campos.js'
import helpersVentas from '../helpers/ventas.js'

const router=Router()

router.get("/listar",httpVentas.getVentas)

router.get("/listarid/:id",httpVentas.getVentasID)

router.post("/escribir",[
  check('idProducto').custom(helpersVentas.validarIdInventario),
    check('valorUnitario','no puede estar vacio el valor unitario y debe ser en numero.').notEmpty().isNumeric(),
    check('cantidad','no puede estar vacio la cantidad y debe ser en numeros.').notEmpty().isNumeric(),
check("cantidad", 'no puede superar la cantidad establecida en inventario').custom(async (value, { req }) => {
    try {
        await helpersVentas.validarCantidadDisponible(req.body.idProducto, req.body.cantidad);
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
}),
    validarCampos
],httpVentas.postVentas)

router.put("/modificar/:id",[  
    check('idProducto').custom(helpersVentas.validarIdInventario),
check('valorUnitario','no puede estar vacio el valor unitario y debe ser en numero.').notEmpty().isNumeric(),
check('cantidad','no puede estar vacio la cantidad y debe ser en numeros.').notEmpty().isNumeric(),
check("cantidad", 'no puede digitar una cantidad superior al máximo establecido').custom(helpersVentas.validarCantidadDisponible),
validarCampos
],httpVentas.putVentas)




export default router