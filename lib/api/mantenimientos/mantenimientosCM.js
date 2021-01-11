"use strict";
/*
 *   Versión 1.0
 *   Creado al 21/09/2020
 *   Creado por: GBautista
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
class MantenimientoCM {
    constructor() {
        // variables de acceso a db
        this.db = admin.firestore();
        this.refMnt = this.db.collection(variables_1.variable['mantenimientos']);
        // Endpoint para retornar un registro de la coleccion MNT.
        this.obtenerMantenimiento = (mantenimiento) => __awaiter(this, void 0, void 0, function* () {
            if (mantenimiento === undefined || mantenimiento === null || mantenimiento === '') {
                return new DataNotFoundException_1.default(codigos_1.codigos.datoNoEncontrado);
            }
            const registro = yield this.refMnt.doc(mantenimiento).get()
                .then(data => {
                if (data.exists) {
                    const document = data.data();
                    let fechaInicio;
                    let fechaFinal;
                    let ret;
                    if (!(document.fecha === undefined || document.fecha === null)) {
                        fechaInicio = document.fecha.toDate().toISOString();
                    }
                    if (!(document.finalizado === undefined || document.finalizado === null)) {
                        fechaFinal = document.finalizado.toDate().toISOString();
                    }
                    if (fechaFinal === undefined) {
                        ret = {
                            title: document.id,
                            start: fechaInicio
                        };
                    }
                    else {
                        ret = {
                            title: document.id,
                            start: fechaInicio,
                            end: fechaFinal
                        };
                    }
                    const response = {
                        doc: document,
                        fullcalendar: ret
                    };
                    return response;
                }
                return new DataNotFoundException_1.default(codigos_1.codigos.datoNoEncontrado);
            })
                .catch(err => {
                return new InternalServerException_1.default(codigos_1.codigos.datoNoEncontrado, err);
            });
            return registro;
        });
        // Endpoint para retornar subcoleccion de la coleccion Mantenimiento por laboratorio.
        this.obtenerLabMNT = (lab) => __awaiter(this, void 0, void 0, function* () {
            const elements = [];
            if (lab === undefined || lab === null || lab === '') {
                return new DataNotFoundException_1.default(codigos_1.codigos.identificadorInvalido);
            }
            const registro = yield this.refMnt.where("laboratorio", "==", lab).get()
                .then(data => {
                if (!data.empty) {
                    for (let index = 0; index < data.size; index++) {
                        if (data.docs[index].exists) {
                            const document = data.docs[index].data();
                            let fechaInicio;
                            let fechaFinal;
                            let ret;
                            // Estructura similar para definir fechas 
                            if (!(document.fecha === undefined || document.fecha === null)) {
                                fechaInicio = document.fecha.toDate().toISOString();
                            }
                            if (!(document.finalizado === undefined || document.finalizado === null)) {
                                fechaFinal = document.finalizado.toDate().toISOString();
                            }
                            // Definiendo tipo de JSON para visualizar
                            if (fechaFinal === undefined) {
                                ret = {
                                    title: document.id,
                                    start: fechaInicio
                                };
                            }
                            else {
                                ret = {
                                    title: document.id,
                                    start: fechaInicio,
                                    end: fechaFinal
                                };
                            }
                            elements[index] = ret;
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
    }
}
exports.default = MantenimientoCM;
//# sourceMappingURL=mantenimientosCM.js.map