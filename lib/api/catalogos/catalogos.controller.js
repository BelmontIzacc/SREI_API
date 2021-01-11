"use strict";
/*
 *   Versión 1.1
 *   Creado al 10/09/2020
 *   Creado por: IBelmonte
 *   Modificado al: 23/10/2020
 *   Editado por: GBautista
 *   Copyright SReI
 */
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
// middleware
const validation_middleware_1 = require("../../middleware/validation.middleware");
const catalogos_dto_1 = require("./catalogos.dto");
// import de archivos CM
const catalogosCM_1 = require("./catalogosCM");
// import de exceptions
const InternalServerException_1 = require("../../exceptions/InternalServerException");
const DataNotFoundException_1 = require("../../exceptions/DataNotFoundException");
// controlador para rutas de equipo
class CatalogosController {
    // constructor del controlador
    constructor(pathGeneral) {
        this.router = express_1.Router();
        this.path = '/catalogos'; // path principal de acceso a las rutas del controlador
        // imports de classes CM
        this.catalogosCM = new catalogosCM_1.default();
        /*
        * @description Endpoint para retornar un registro de la coleccion EQP.
        * @params uid
        * @param  uid(id del usuario tomado de params)
        * @retuns {estatus:true/false, eqp: {...} }
        * @author Belmont
        */
        this.obtenerEquipo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const prueba = req.params.uid;
            const respuesta = yield this.catalogosCM.obtenerEquipo(prueba);
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
        * @author GBautista
        */
        this.obtenerEquipoTipo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const tipo = req.params.tipo;
            const respuesta = yield this.catalogosCM.obtenerEquipoTipo(tipo);
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
        /*
        * @description Endpoint para editar un registro de la coleccion EQP.
        * @params id,tipo,nombre,estado,disponible,propietario,caracteristicas, checklist
        * @param  id(id del registro), tipo(tipo del equipo), nombre(nombre del equipo), estado(indica el estado del equipo),
        * disponible(indica si se encuentra disponible), propietario(dueño del equipo UPIIZ),
        * caracteristicas(Arreglo en el que se especifican características generales del equipo),
        * checklist(Array solo está presente en la maquinaria)
        * @retuns {estatus:Exito/error, editado: true, eqp: {...} }
        * @author Belmont
        */
        this.editarEquipo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const eqp = req.body;
            const respuesta = yield this.catalogosCM.editarEquipo(eqp);
            if (respuesta instanceof DataNotFoundException_1.default) {
                res.send(respuesta);
                return;
            }
            if (respuesta instanceof InternalServerException_1.default) {
                res.send(respuesta);
                return;
            }
            res.send({ estatus: true, editado: true, eqp: respuesta });
        });
        /*
        * @description Endpoint para eliminar un registro de la coleccion EQP.
        * @params id
        * @param  id(id del registro tomado de params)
        * @retuns {estatus:Exito/error, eliminado: true, eqp: '...' }
        * @author Belmont
        */
        this.eliminarEquipo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const key = req.params.id;
            const respuesta = yield this.catalogosCM.eliminarEquipo(key);
            if (respuesta instanceof DataNotFoundException_1.default) {
                res.send(respuesta);
                return;
            }
            if (respuesta instanceof InternalServerException_1.default) {
                res.send(respuesta);
                return;
            }
            res.send({ estatus: true, eliminado: true, eqp: respuesta });
        });
        /*
        * @description Endpoint para crear un registro en la coleccion EQP.
        * @params id,tipo,nombre,estado,disponible,propietario,caracteristicas, checklist
        * @param  id(id del registro), tipo(tipo del equipo), nombre(nombre del equipo), estado(indica el estado del equipo),
        * disponible(indica si se encuentra disponible), propietario(dueño del equipo UPIIZ),
        * caracteristicas(Arreglo en el que se especifican características generales del equipo),
        * checklist(Array solo está presente en la maquinaria)
        * @retuns {estatus:Exito/error, creado: true, eqp: {...} }
        * @author Belmont
        */
        this.crearEquipo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const eqp = req.body;
            const respuesta = yield this.catalogosCM.crearEquipo(eqp);
            if (respuesta instanceof DataNotFoundException_1.default) {
                res.send(respuesta);
                return;
            }
            if (respuesta instanceof InternalServerException_1.default) {
                res.send(respuesta);
                return;
            }
            res.send({ estatus: true, creado: true, eqp: respuesta });
        });
        this.path = pathGeneral + '' + this.path;
        this.initializeRoutes();
    }
    // Al iniciar el controlador carga las respectivas rutas
    initializeRoutes() {
        this.router.get(this.path + '/equipo/:uid', this.obtenerEquipo);
        this.router.get(this.path + '/equipo/tipo/:tipo', this.obtenerEquipoTipo);
        this.router.put(this.path + '/equipo', validation_middleware_1.default(catalogos_dto_1.EditarEquipo, true), this.editarEquipo);
        this.router.delete(this.path + '/equipo/:id', this.eliminarEquipo);
        this.router.post(this.path + '/equipo', validation_middleware_1.default(catalogos_dto_1.CrearEquipo, true), this.crearEquipo);
    }
}
exports.default = CatalogosController;
//# sourceMappingURL=catalogos.controller.js.map