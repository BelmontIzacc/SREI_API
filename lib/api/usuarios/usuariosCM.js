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
const admin = require("firebase-admin");
const codigos_1 = require("../../exceptions/codigos");
const variables_1 = require("../variables");
//import de exceptions
const DataNotFoundException_1 = require("../../exceptions/DataNotFoundException");
const InternalServerException_1 = require("../../exceptions/InternalServerException");
const axios = require('axios');
// client manager, contiene toda la logica del manejo de los datos
class UsuariosCM {
    constructor() {
        // variables de acceso a db
        this.db = admin.firestore();
        this.refUs = this.db.collection(variables_1.variable['usuarios']);
        /*
         * @description Endpoint para registrar o logearse dentro del sistema.
         * @params
         *   @param  username(username para ingresar)
         *   @param  password(password para auth)
         * @retuns {usr: {...} }
         * @author obelmonte
         */
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
        /*
         * @description Realiza una consulta a la API de la escuela
         * @params
         *   @param  path(ruta de API de la escuela, existe una para alumnos y otra para trabajadores)
         *   @param  data(datos de autenticacion del SAES del ususario)
         * @retuns {estatus:boolean, datos: {...} }
         * @author obelmonte
         */
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
        /*
         * @description Recupera los datos del usuario de la base de datos
         * @params
         *   @param  boleta(identificador del usuario dentro de la base de datos)
         * @retuns { ... }
         * @author obelmonte
         */
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
        /*
         * @description Recupera los datos de un trabajador de la base de datos
         * @params
         *   @param  rfc(identificador del usuario dentro de la base de datos)
         *   @param  password(contraseña de acceso dentro de la base de datos)
         * @retuns { ... }
         * @author obelmonte
         */
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
        /*
         * @description Registra un alumno a la base de datos
         * @params
         *   @param  boleta(identificador del alumno dentro de la base de datos)
         *   @param  nombre(nombre de usuario registrado)
         * @retuns { ... }
         * @author obelmonte
         */
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
        /*
         * @description registro de empleados.
         * @params
         *   @param  tipo(tipo del empleado: doscente o tecnico)
         *   @param  rfc(rfc del empleado)
         *   @param  pass(password para auth)
         *   @param  laboratorio sobre el que tiene jurisdiccion
         * @retuns { ... }
         * @author obelmonte
         */
        this.registrarEmpleado = (tipo, rfc, pass, edificio) => __awaiter(this, void 0, void 0, function* () {
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
        this.obtenerUsuario = (id) => __awaiter(this, void 0, void 0, function* () {
            const registro = yield this.refUs.doc(id).get()
                .then((data) => {
                if (data.exists) {
                    const document = data.data();
                    return document;
                }
                return new DataNotFoundException_1.default(codigos_1.codigos.datosNoEncontrados);
            }).catch((error) => {
                return new InternalServerException_1.default(codigos_1.codigos.datoNoEncontrado);
            });
            return registro;
        });
        /*
        * @description cambio del esatdo de vetado de un usuario a los lavoratorios dentro del sistema
        * @params
        *   @param id(id del usuario que será modificado)
        *   @param vetado(booleano del estado de vetado del usuario)
        * @returns  { ... }
        * @author obelmonte
        */
        this.actualizarVetado = (usuario_id, vetado, laboratorio_id) => __awaiter(this, void 0, void 0, function* () {
            if (usuario_id === undefined || usuario_id === null || usuario_id === ''
                || laboratorio_id === undefined || laboratorio_id === null || laboratorio_id === '') {
                return new DataNotFoundException_1.default(codigos_1.codigos.identificadorInvalido);
            }
            const usuario = yield this.obtenerUsuario(usuario_id);
            if (usuario instanceof DataNotFoundException_1.default || usuario instanceof InternalServerException_1.default) {
                return usuario;
            }
            let vetados = usuario.vetado;
            try {
                vetados[laboratorio_id] = vetado;
            }
            catch (error) {
                vetados = {};
                vetados[laboratorio_id] = vetado;
            }
            const datos = {
                vetado: vetados,
                actualizado: admin.firestore.Timestamp.now().toDate()
            };
            //const usuario = await this.refUs.where('id', '==', id).get();
            const actualizado = yield this.refUs.doc(usuario_id).update(datos)
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const editado = yield this.obtenerUsuario(usuario_id);
                return editado;
            }))
                .catch(err => {
                return new InternalServerException_1.default(codigos_1.codigos.datoNoEncontrado, err);
            });
            return actualizado;
        });
        /*
         * @description obtencion del estado de vetado de un usuario
         * @params
         *   @param id(id del usuario que será consultado)
         * @returns  true/false
         * @author obelmonte
         */
        this.rebisarVetado = (usuario_id, laboratorio_id) => __awaiter(this, void 0, void 0, function* () {
            if (usuario_id === undefined || usuario_id === null || usuario_id === ''
                || laboratorio_id === undefined || laboratorio_id === null || laboratorio_id === '') {
                return new DataNotFoundException_1.default(codigos_1.codigos.identificadorInvalido);
            }
            const registro = yield this.obtenerUsuario(usuario_id);
            if (registro instanceof DataNotFoundException_1.default ||
                registro instanceof InternalServerException_1.default) {
                return registro;
            }
            const vetado = new Map(Object.entries(registro.vetado));
            return vetado.get(laboratorio_id);
        });
        /*
         * @description busca todos los usuarios de un tipo especifico
         * @params
         *   @param  tipo(valor numerico correspondiente al tipo del grupo de usuaios a consultar)
         * @retuns {usuarios: [{...}, ...] }
         * @author obelmonte
         */
        this.grupoUsuarios = (tipo) => __awaiter(this, void 0, void 0, function* () {
            const elements = [];
            console.log(tipo);
            if (tipo === undefined || tipo === null || tipo < 0 || tipo > 3) {
                return new DataNotFoundException_1.default(codigos_1.codigos.datosNoEncontrados);
            }
            const usuarios = yield this.refUs.where('tipo', '==', tipo).get().then(data => {
                if (!data.empty) {
                    for (let index = 0; index < data.size; index++) {
                        if (data.docs[index].exists) {
                            elements[index] = data.docs[index].data();
                        }
                        else {
                            return new DataNotFoundException_1.default(codigos_1.codigos.datoNoEncontrado);
                        }
                    }
                    return elements;
                }
                return new DataNotFoundException_1.default(codigos_1.codigos.datoNoEncontrado);
            }).catch(err => {
                return new InternalServerException_1.default(codigos_1.codigos.datoNoEncontrado, err);
            });
            return usuarios;
        });
        this.testLogin = (usuario, clave) => __awaiter(this, void 0, void 0, function* () {
            if (usuario === undefined || usuario === null || clave === undefined || clave === null) {
                return new DataNotFoundException_1.default(codigos_1.codigos.datosNoEncontrados);
            }
            const us = yield this.refUs.where('usuario', '==', usuario).where('clave', '==', clave).get();
            if (us === undefined || us === null) {
                return new DataNotFoundException_1.default(codigos_1.codigos.datoNoEncontrado);
            }
            return us.docs[0].data();
        });
    }
}
exports.default = UsuariosCM;
//# sourceMappingURL=usuariosCM.js.map