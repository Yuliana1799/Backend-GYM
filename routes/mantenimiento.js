import {Router} from 'express'
import httpMantenimiento from '../controllers/mantenimiento.js'
import { check } from 'express-validator'
import { validarCampos } from '../middlewares/validar-campos.js'
import helpersMantenimiento from '../helpers/mantenimiento.js'
import { validarJWT } from '../middlewares/validar-jwt.js'

const router=Router()
router.get("/listar", [validarJWT],httpMantenimiento.getMantenimiento)
router.get("/listarid/:id",httpMantenimiento.getMantenimientoID)

router.post("/escribir",[
    check('idMaquina','Se necesita un mongoId valido').isMongoId(),
    check('idMaquina').custom(helpersMantenimiento.validarIdMaquina),
    check('descripcion','la descripcion no puede estar vacia.').notEmpty(),
    check('responsable','digite el nombre del responsable.').notEmpty(),
    check('valor','el valor del mantenimiento no puede estar vacio.').notEmpty(),
    validarCampos
],httpMantenimiento.postMantenimiento)

router.put("/modificar/:id",[
    check('idMaquina','Se necesita un mongoId valido').isMongoId(),
    check('idMaquina').custom(helpersMantenimiento.validarIdMaquina),
    check('id','Se necesita un mongoId valido').isMongoId(),
    check('id').custom(helpersMantenimiento.validarIdMantenimiento),
    check('descripcion','la descripcion no puede estar vacia.').notEmpty(),
    validarCampos
],httpMantenimiento.putMantenimiento)


export default router