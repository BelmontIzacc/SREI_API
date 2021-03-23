"use strict";
/*
 * autor: ibelmonte
 * modifico: obelmonte
 * fecha de modificacion: 16/12/2020
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
const InternalServerException_1 = require("../../exceptions/InternalServerException");
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
         *   @param  username(username para ingresar),
         *   @param  password(password para auth)
         * @retuns {estatus:boolean,  usuario: {...} }
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
        /*
         * @description Endpoint para registrar a un empleado dentro del sistema.
         * @params
         *   @param  tipo(tipo del empleado: doscente o tecnico)
         *   @param  rfc(rfc del empleado)
         *   @param  pass(password para auth)
         *   @param  laboratorio sobre el que tiene jurisdiccion
         * @retuns {estatus:boolean, usuario: {...} }
         * @author obelmonte
         */
        this.registrarEmpleado = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const datos = req.body;
            const respuesta = yield this.usuariosCM.registrarEmpleado(datos.tipo, datos.rfc, datos.pass, datos.laboratorio);
            if (respuesta instanceof DataNotFoundException_1.default) {
                next(respuesta);
                console.log(respuesta);
                return;
            }
            res.send({ estatus: true, usuario: respuesta });
        });
        /*
         * @description Endpoint para cambiar el esatdo de vetado de un usuario a los lavoratorios dentro del sistema
         * @params
         *   @param usuario_id(id del usuario que será modificado)
         *   @param laboraotio_id(id del laboratorio base)
         *   @param vetado(booleano del estado de vetado del usuario)
         * @returns {
         *              estatus: true/false,
         *              editado: true,
         *              usuario: { ... }
         *          }
         * @author obelmonte
         */
        this.cambiarVetado = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { usuario_id, vetado, laboratorio_id } = req.body;
            const respuesta = yield this.usuariosCM.actualizarVetado(usuario_id, vetado, laboratorio_id);
            if (respuesta instanceof DataNotFoundException_1.default ||
                respuesta instanceof InternalServerException_1.default) {
                res.send(respuesta);
            }
            res.send({
                estatus: true,
                editado: true,
                usuario: respuesta
            });
        });
        /*
         * @description consulta del esatdo de vetado de un usuario a los lavoratorios dentro del sistema
         * @params
         *   @param usuario_id(id del usuario que será consultado)
         *   @param laboratorio_id(id del laboratorio base de la consulta)
         * @returns
         *      {
         *          estatus: true/false
         *          vetado: true/false
         *      }
         * @author obelmonte
         */
        this.berificarVetado = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { usuario_id, laboratorio_id } = req.body;
            const vetado = yield this.usuariosCM.rebisarVetado(usuario_id, laboratorio_id);
            if (vetado instanceof DataNotFoundException_1.default ||
                vetado instanceof InternalServerException_1.default) {
                res.send(vetado);
            }
            res.send({
                estatus: true,
                vetado
            });
        });
        /*
         * @description consulta la existencia de usuarios de un tipo especifico
         * @params
         *   @param tipo (valor numerico del tipo de usuarios a buscar)
         * @returns
         *      {
         *          estatus: true/false
         *          usuarios: [{...}, ...]
         *      }
         * @author obelmonte
         */
        this.grupoUsuarios = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let { tipo } = req.body;
            if (tipo === null || tipo === undefined) {
                const t = "" + req.query.tipo;
                tipo = parseInt(t);
            }
            console.log(tipo);
            const usuarios = yield this.usuariosCM.grupoUsuarios(tipo);
            if (usuarios instanceof DataNotFoundException_1.default ||
                usuarios instanceof InternalServerException_1.default) {
                res.send(usuarios);
            }
            res.send({
                estatus: true,
                usuarios
            });
        });
        this.path = pathGeneral + '' + this.path;
        this.initializeRoutes();
    }
    /*
     * @description Al iniciar el controlador carga las respectivas rutas
     * @author ibelmonte
     */
    initializeRoutes() {
        this.router.get(this.path + '/login', this.ingresar);
        this.router.post(this.path + '/register', this.registrarEmpleado);
        this.router.get(this.path + '/vetado', this.berificarVetado);
        this.router.patch(this.path + '/vetado', this.cambiarVetado);
        this.router.get(this.path + '/usuarios/tipo', this.grupoUsuarios);
    }
}
exports.default = UsuariosController;
//# sourceMappingURL=usuarios.controller.js.map