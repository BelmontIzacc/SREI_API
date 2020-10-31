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
const DataNotFoundException_1 = require("../../exceptions/DataNotFoundException");
// import de archivos CM
const usuariosCM_1 = require("./usuariosCM");
// controlador para rutas de equipo
class UsuariosController {
    // constructor del controlador
    constructor(pathGeneral) {
        this.router = express_1.Router();
        this.path = '/usuarios'; // path principal de acceso a las rutas del controlador
        // imports de classes CM
        this.usuariosCM = new usuariosCM_1.default();
        /*
        * @description Endpoint para registrar o logearse dentro del sistema.
        * @params
        * @param  username(username para ingresar), password(password para auth)
        * @retuns {estatus:boolean, ingresar: true, eqp: {...} }
        * @author obelmonte
        */
        this.ingresar = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const credenciales = req.body;
            const respuesta = yield this.usuariosCM.ingresar(credenciales);
            if (respuesta instanceof DataNotFoundException_1.default) {
                next(respuesta);
                return;
            }
            res.send({ estatus: true, usuario: respuesta });
        });
        this.registrarEmpleado = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const datos = req.body;
            const respuesta = yield this.usuariosCM.registrarempleado(datos.tipo, datos.rfc, datos.pass, datos.laboratorio);
            if (respuesta instanceof DataNotFoundException_1.default) {
                next(respuesta);
                console.log(respuesta);
                return;
            }
            res.send({ estatus: true, usuario: respuesta });
        });
        this.path = pathGeneral + '' + this.path;
        this.initializeRoutes();
    }
    // Al iniciar el controlador carga las respectivas rutas
    initializeRoutes() {
        this.router.get(this.path + '/login', this.ingresar);
        this.router.post(this.path + '/register', this.registrarEmpleado);
    }
}
exports.default = UsuariosController;
//# sourceMappingURL=usuarios.controller.js.map