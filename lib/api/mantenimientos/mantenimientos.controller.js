"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import de archivos CM
const mantenimientosCM_1 = require("./mantenimientosCM");
// import de exceptions
const InternalServerException_1 = require("../../exceptions/InternalServerException");
const DataNotFoundException_1 = require("../../exceptions/DataNotFoundException");
// controlador para rutas de equipo
class MantenimientosController {
    // constructor del controlador
    constructor(pathGeneral) {
        this.router = express_1.Router();
        this.path = '/mantenimientos'; // path principal de acceso a las rutas del controlador
        // imports de classes CM
        this.mantenimientosCM = new mantenimientosCM_1.default();
        /*
        * @description Endpoint para retornar un registro de la coleccion EQP.
        * @params uid
        * @param  uid(id del usuario tomado de params)
        * @retuns {estatus:true/false, eqp: {...} }
        * @author Belmont
        */
        this.obtenerMantenimiento = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const prueba = req.params.idm;
            const respuesta = yield this.mantenimientosCM.obtenerMantenimiento(prueba);
            if (respuesta instanceof DataNotFoundException_1.default) {
                res.send(respuesta);
                return;
            }
            if (respuesta instanceof InternalServerException_1.default) {
                res.send(respuesta);
                return;
            }
            res.send({ estatus: true, eqp: respuesta });
        });
        /*
        * @description Endpoint para retornar una sub coleccion de la coleccion EQP.
        * @params tipo
        * @param  tipo(tipo del equipo tomado de params)
        * @retuns {estatus:Exito/error, eqps: {...} }
        */
        this.obtenerMantenimientosLab = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const lab = req.params.lab;
            const respuesta = yield this.mantenimientosCM.obtenerLabMNT(lab);
            if (respuesta instanceof DataNotFoundException_1.default) {
                res.send(respuesta);
                return;
            }
            if (respuesta instanceof InternalServerException_1.default) {
                res.send(respuesta);
                return;
            }
            res.send({ estatus: true, eqps: respuesta });
        });
        this.path = pathGeneral + '' + this.path;
        this.initializeRoutes();
    }
    // Al iniciar el controlador carga las respectivas rutas
    initializeRoutes() {
        this.router.get(this.path + '/equipo/:idm', this.obtenerMantenimiento);
        this.router.get(this.path + '/lab/:lab', this.obtenerMantenimientosLab);
    }
}
exports.default = MantenimientosController;
//# sourceMappingURL=mantenimientos.controller.js.map