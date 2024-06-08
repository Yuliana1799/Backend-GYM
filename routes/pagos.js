import {Router} from 'express'
import httpPagos from '../controllers/pagos.js'
import { check } from 'express-validator'
import { validarCampos } from '../middlewares/validar-campos.js'
import helpersPagos from '../helpers/pagos.js'
import { validarJWT } from '../middlewares/validar-jwt.js'

const router=Router()

router.get("/listar",[
  // validarJWT,
],httpPagos.getPagos)

router.get("/listarid/:id",httpPagos.getPagosID)

router.get("/listaractivados",httpPagos.getPagosactivados)

router.get("/listardesactivados",httpPagos.getPagosdesactivados)


router.post("/escribir",[
  check('idCliente').custom(helpersPagos.validarIdCliente),
  check('IdPlan').custom(helpersPagos.validarIdPlan),
  check('fecha', 'ingrese bien la fecha.').toDate(),
  check('fecha').custom(helpersPagos.validarFechaPago),
],httpPagos.postPagos)

router.put("/modificar/:id",[
  check('id','Se necesita un mongoid valido').isMongoId(),
  check('id').custom(helpersPagos.validarIdPago),
  check('plan', 'en digitos.').isNumeric(),
  validarCampos
],httpPagos.putPagos)

router.put("/activar/activos/:id",[
  check('id','Se necesita un mongoid valido').isMongoId(),
  check('id').custom(helpersPagos.validarIdPago),  
  validarCampos
],httpPagos.putPagosActivar)

router.put("/desactivar/desactivados/:id",[
  check('id','Se necesita un mongoid valido').isMongoId(),
  check('id').custom(helpersPagos.validarIdPago), 
  validarCampos
],httpPagos.putPagosDesactivar)


export default router