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
const admin = require("firebase-admin");
const variables_1 = require("../variables");
const codigos_1 = require("../../exceptions/codigos");
// import de exceptions
const InternalServerException_1 = require("../../exceptions/InternalServerException");
const DataNotFoundException_1 = require("../../exceptions/DataNotFoundException");
// client manager, contiene toda la logica del manejo de los datos
class CatalogosCM {
    constructor() {
        // variables de acceso a db
        this.db = admin.firestore();
        this.refEqp = this.db.collection(variables_1.variable['equipo']);
        // Endpoint para retornar un registro de la coleccion EQP.
        this.obtenerEquipo = (equipo) => __awaiter(this, void 0, void 0, function* () {
            if (equipo === undefined || equipo === null || equipo === '') {
                return new DataNotFoundException_1.default(codigos_1.codigos.datoNoEncontrado);
            }
            const registro = yield this.refEqp.doc(equipo).get()
                .then(data => {
                if (data.exists) {
                    const document = data.data();
                    return document;
                }
                return new DataNotFoundException_1.default(codigos_1.codigos.datoNoEncontrado);
            })
                .catch(err => {
                return new InternalServerException_1.default(codigos_1.codigos.datoNoEncontrado);
            });
            return registro;
        });
        // Endpoint para retornar subcoleccion de la coleccion EQP por tipo.
        this.obtenerEquipoTipo = (tipo) => __awaiter(this, void 0, void 0, function* () {
            const elements = [];
            if (tipo === undefined || tipo === null || tipo === '') {
                return new DataNotFoundException_1.default(codigos_1.codigos.identificadorInvalido);
            }
            const registro = yield this.refEqp.where("tipo", "==", tipo).get()
                .then(data => {
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
            return registro;
        });
        // Endpoint para editar un registro de la coleccion EQP.
        this.editarEquipo = (equipo) => __awaiter(this, void 0, void 0, function* () {
            if (equipo === undefined || equipo === null) {
                return new DataNotFoundException_1.default(codigos_1.codigos.datosNoEncontrados);
            }
            const key = equipo.id;
            const existe = yield this.obtenerEquipo(key);
            if (existe instanceof DataNotFoundException_1.default) {
                return existe;
            }
            if (existe instanceof InternalServerException_1.default) {
                return existe;
            }
            const actual = admin.firestore.Timestamp.now().toDate(); // obtener hora y fecha del servidor
            equipo.actualizado = actual;
            const editado = yield this.refEqp.doc(key).update(equipo)
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const document = yield this.obtenerEquipo(key);
                return document;
            }))
                .catch(err => {
                return new InternalServerException_1.default(codigos_1.codigos.datoNoEncontrado, err);
            });
            return editado;
        });
        // Endpoint para eliminar un registro de la coleccion EQP.
        this.eliminarEquipo = (equipo) => __awaiter(this, void 0, void 0, function* () {
            if (equipo === undefined || equipo === null || equipo === '') {
                return new DataNotFoundException_1.default(codigos_1.codigos.identificadorInvalido);
            }
            const existe = yield this.obtenerEquipo(equipo);
            if (existe instanceof DataNotFoundException_1.default) {
                return existe;
            }
            if (existe instanceof InternalServerException_1.default) {
                return existe;
            }
            const eliminar = yield this.refEqp.doc(equipo).delete()
                .then(() => {
                return equipo;
            })
                .catch(err => {
                return new InternalServerException_1.default(codigos_1.codigos.datoNoEncontrado, err);
            });
            return eliminar;
        });
        // Endpoint para crear un registro en la coleccion EQP.
        this.crearEquipo = (equipo) => __awaiter(this, void 0, void 0, function* () {
            if (equipo === undefined || equipo === null) {
                return new DataNotFoundException_1.default(codigos_1.codigos.datosNoEncontrados);
            }
            const actual = admin.firestore.Timestamp.now().toDate(); // obtener hora y fecha del servidor
            equipo.actualizado = actual;
            equipo.creacion = actual;
            if (equipo.checklist === undefined || equipo.checklist === null) {
                equipo.checklist = null;
            }
            const creado = yield this.refEqp.add(equipo)
                .then((data) => __awaiter(this, void 0, void 0, function* () {
                const key = data.id;
                const eqp = yield this.refEqp.doc(key).update({ id: key })
                    .then(() => {
                    return key;
                })
                    .catch(err => {
                    return new InternalServerException_1.default(codigos_1.codigos.datoNoEncontrado, err);
                });
                return eqp;
            }))
                .catch(err => {
                return new InternalServerException_1.default(codigos_1.codigos.datoNoEncontrado, err);
            });
            if (creado instanceof InternalServerException_1.default) {
                return creado;
            }
            const document = yield this.obtenerEquipo(creado);
            return document;
        });
    }
}
exports.default = CatalogosCM;
//# sourceMappingURL=catalogosCM.js.map