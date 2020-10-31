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
const admin = require("firebase-admin");
const codigos_1 = require("../../exceptions/codigos");
const variables_1 = require("../variables");
//import de exceptions
const DataNotFoundException_1 = require("../../exceptions/DataNotFoundException");
const axios = require('axios');
// client manager, contiene toda la logica del manejo de los datos
class UsuariosCM {
    constructor() {
        // variables de acceso a db
        this.db = admin.firestore();
        this.refUs = this.db.collection(variables_1.variable['usuarios']);
        // Endpoint para registrar o logearse dentro del sistema.
        this.ingresar = (credenciales) => __awaiter(this, void 0, void 0, function* () {
            // Expresiones regulares para boleta o RFC
            const expRFC = /[A-Z][A-Z][A-Z][A-Z[0-9][0-9][0-9][0-9][0-9][0-9][A-Z][A-Z]/;
            const expBoleta = /[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]/;
            let requestData; // Datos que se envian a la api de la UPIIZ
            let path; // ruta de api de la UPIIZ
            let alumno;
            if (expBoleta.test(credenciales.username)) {
                requestData = {
                    username: credenciales.username,
                    password: credenciales.password
                };
                path = '/pump/web/index.php/login';
                alumno = true;
            }
            else if (expRFC.test(credenciales.username)) {
                requestData = {
                    rfc: credenciales.username,
                };
                path = '/pump/web/index.php/personal';
                alumno = false;
            }
            else {
                return new DataNotFoundException_1.default(codigos_1.codigos.datosNoEncontrados);
            }
            const response = yield this.peticionExterna(path, requestData);
            const estatus = response.estatus;
            let usr = null;
            if (estatus === true) {
                if (alumno) {
                    usr = yield this.loginUser(credenciales.username);
                    if (usr instanceof DataNotFoundException_1.default) {
                        const data = response.datos;
                        usr = yield this.register(data.boleta, data.Nombre);
                    }
                }
                else {
                    usr = yield this.loginUserTrabajadores(credenciales.username, credenciales.password);
                    if (usr instanceof DataNotFoundException_1.default) {
                        console.log("No se encontro usuario");
                    }
                }
                console.log("usr: ", usr);
                return usr;
            }
            return new DataNotFoundException_1.default(codigos_1.codigos.noEncontradoUsuario);
        });
        // realizar una peticion a un sitio externo
        this.peticionExterna = (path, data) => __awaiter(this, void 0, void 0, function* () {
            let httpResponse;
            const url = 'http://148.204.142.2' + path;
            const header = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 584423298741328'
                }
            };
            try {
                httpResponse = yield axios.post(url, data, header);
            }
            catch (error) {
                console.error(error.body);
                httpResponse = 'error';
            }
            return httpResponse.data;
        });
        // login de usuario
        this.loginUser = (boleta) => __awaiter(this, void 0, void 0, function* () {
            if (boleta === undefined || boleta === null || boleta === '') {
                return new DataNotFoundException_1.default(codigos_1.codigos.datoNoEncontrado);
            }
            const us = yield this.refUs.where('usuario', '==', boleta).get();
            if (us.empty) {
                return new DataNotFoundException_1.default(codigos_1.codigos.noEncontradoUsuario);
            }
            const users = us.docs.map(data => data.data());
            console.log(users);
            return users[0]; // parte de la teoria que solo existe un usuario con la boleta indicada
        });
        // login de trabajadores
        this.loginUserTrabajadores = (rfc, password) => __awaiter(this, void 0, void 0, function* () {
            if (rfc === undefined || rfc === null || rfc === '') {
                return new DataNotFoundException_1.default(codigos_1.codigos.datoNoEncontrado);
            }
            if (password === undefined || password === null || password === '') {
                return new DataNotFoundException_1.default(codigos_1.codigos.datoNoEncontrado);
            }
            const us = yield this.refUs.where('usuario', '==', rfc).where('clave', '==', password).get();
            if (us.empty) {
                return new DataNotFoundException_1.default(codigos_1.codigos.noEncontradoUsuario);
            }
            const users = us.docs.map(data => data.data());
            return users[0]; // parte de la teoria que solo existe un usuario con el rfc y la clave
        });
        // registra un usuario
        this.register = (boleta, nombre) => __awaiter(this, void 0, void 0, function* () {
            if (boleta === undefined || boleta === null || boleta === '') {
                return new DataNotFoundException_1.default(codigos_1.codigos.datoNoEncontrado);
            }
            const usr = {
                tipo: 0,
                usuario: boleta,
                nombre: nombre,
                id: ''
            };
            const saveUser = yield this.refUs.add(usr);
            const key = saveUser.id;
            yield saveUser.update({ id: key });
            usr.id = key;
            return usr;
        });
        // registro para empleados
        this.registrarempleado = (tipo, rfc, pass, edificio) => __awaiter(this, void 0, void 0, function* () {
            if (rfc === undefined || rfc === null || rfc === '') {
                return new DataNotFoundException_1.default(codigos_1.codigos.datoNoEncontrado);
            }
            if (pass === undefined || pass === null || pass === '') {
                return new DataNotFoundException_1.default(codigos_1.codigos.datoNoEncontrado);
            }
            const requestData = {
                rfc: rfc
            };
            const response = yield this.peticionExterna('/pump/web/index.php/personal', requestData);
            if (response.estatus === true) {
                let usr;
                usr = {
                    tipo: tipo,
                    usuario: rfc,
                    clave: pass,
                    nombre: response.datos.nombre,
                    edificio: edificio,
                    id: ''
                };
                const saveUser = yield this.refUs.add(usr);
                const key = saveUser.id;
                yield saveUser.update({ id: key });
                usr.id = key;
                return usr;
            }
            return new DataNotFoundException_1.default(codigos_1.codigos.noEncontradoUsuario);
        });
    }
}
exports.default = UsuariosCM;
//# sourceMappingURL=usuariosCM.js.map