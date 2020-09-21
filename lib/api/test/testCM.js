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
const variables_1 = require("../variables");
// client manager, contiene toda la logica del manejo de los datos
// todo esto esta todo rudimentario y feo xD no le hagan caso solo es para llenar la base de datos
class TestCM {
    constructor() {
        // variables de acceso a db
        this.db = admin.firestore();
        // numero de registros
        this.num = 500;
        this.refUsr = this.db.collection(variables_1.variable['usuarios']);
        this.refLab = this.db.collection(variables_1.variable['laboratorio']);
        this.refMs = this.db.collection(variables_1.variable['mesas']);
        this.refEqp = this.db.collection(variables_1.variable['equipo']);
        this.refMnt = this.db.collection(variables_1.variable['mantenimientos']);
        this.refPrt = this.db.collection(variables_1.variable['prestamos']);
        // generar colecciones y datos para la db
        this.generar = () => __awaiter(this, void 0, void 0, function* () {
            yield this.generarLaboratorios();
            yield this.generarUsuarios();
            yield this.generarMesas();
            yield this.generarEqp();
            yield this.generarMnt();
            yield this.generarPrestamo();
        });
        this.generarPrestamo = () => __awaiter(this, void 0, void 0, function* () {
            const prestamo = yield this.refPrt.get();
            const data = prestamo.docs.map(dato => dato.data());
            if (data.length !== 0) {
                console.log('Borrar Prestamo');
                for (let i in data) {
                    const id = data[i].id;
                    yield this.refPrt.doc(id).delete();
                }
            }
            console.log('Crear Prestamo');
            const total = this.num * 3;
            const equipo = yield this.refEqp.get();
            const dataEqp = equipo.docs.map(dato => dato.data());
            const mesas = yield this.refMs.get();
            const dataMesa = mesas.docs.map(dato => dato.data());
            for (let i = 0; i < total; i++) {
                const seleccionar = yield this.generarAleatorio(0, dataEqp.length);
                const eqp = dataEqp[seleccionar];
                const dis = eqp.disponible;
                const actual = new Date();
                const selMesa = yield this.generarAleatorio(0, dataMesa.length);
                const mesa = dataMesa[selMesa];
                if (mesa.usuarios.length !== 0) {
                    const selUserMesa = yield this.generarAleatorio(1, mesa.usuarios.length);
                    const user = mesa.usuarios[selUserMesa].USR;
                    if (dis) {
                        const pre = {
                            USR: user,
                            EQP: eqp.id,
                            LAB: eqp.laboratorio,
                            MS: mesa.id,
                            activo: false,
                            solicitud: actual,
                            entrega: actual,
                            creacion: actual,
                            actualizado: actual
                        };
                        const addPre = yield this.refPrt.add(pre);
                        yield this.refPrt.doc(addPre.id).update({ id: addPre.id });
                    }
                }
            }
            console.log('Termino prestamo');
        });
        // borra la coleccion mantenimiento y la vuelve a crear
        this.generarMnt = () => __awaiter(this, void 0, void 0, function* () {
            const mante = yield this.refMnt.get();
            const data = mante.docs.map(dato => dato.data());
            if (data.length !== 0) {
                console.log('Borrar Mnt');
                for (let i in data) {
                    const id = data[i].id;
                    yield this.refMnt.doc(id).delete();
                }
            }
            console.log('Crear Mnt');
            const cantidad = yield this.generarAleatorio(20, this.num);
            const equipo = yield this.refEqp.get();
            const dataEqp = equipo.docs.map(dato => dato.data());
            for (let i = 0; i < cantidad; i++) {
                const elegirRegistro = yield this.generarAleatorio(1, dataEqp.length);
                const eqp = dataEqp[elegirRegistro];
                const actual = new Date();
                const estado = eqp.estado;
                if (estado !== 2) {
                    let fin = null;
                    switch (estado) {
                        case 1: {
                            fin = null;
                            break;
                        }
                        case 3: {
                            fin = new Date();
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                    const propie = eqp.propietario;
                    const mnt = {
                        equipo: eqp.id,
                        laboratorio: eqp.laboratorio,
                        responsable: propie,
                        fecha: actual,
                        finalizado: fin,
                        creacion: actual,
                        actualizado: actual
                    };
                    const addMnt = yield this.refMnt.add(mnt);
                    yield this.refMnt.doc(addMnt.id).update({ id: addMnt.id });
                }
            }
            console.log('Termino crear Mnt');
        });
        // borra la coleccion equipo y la vuelve a crear
        this.generarEqp = () => __awaiter(this, void 0, void 0, function* () {
            const equipo = yield this.refEqp.get();
            const data = equipo.docs.map(dato => dato.data());
            if (data.length !== 0) {
                console.log('Borrar eqp');
                for (let i in data) {
                    const id = data[i].id;
                    if (id !== undefined && id !== null) {
                        yield this.refEqp.doc(id).delete();
                    }
                }
            }
            console.log('Crear eqp');
            const superUs = yield this.refUsr.add(this.userUpiiz);
            const actual = new Date();
            yield this.refUsr.doc(superUs.id).update({ creacion: actual, actualizado: actual, id: superUs.id });
            const usDoc = yield this.refUsr.get();
            const usData = usDoc.docs.map(dato => dato.data());
            for (let i = 0; i < this.num; i++) {
                const probabiliadPertenece = yield this.generarAleatorio(0, 6);
                let pertenece = '';
                if (probabiliadPertenece === 3) {
                    const user = yield this.generarAleatorio(0, usData.length);
                    pertenece = '' + usData[user].id;
                }
                pertenece = '' + superUs.id;
                const alTipo = yield this.generarAleatorio(0, this.tipoEquipo.length);
                const tipo = this.tipoEquipo[alTipo];
                const alNombre = yield this.generarAleatorio(0, this.nombreEquipo.length);
                const nombre = this.nombreEquipo[alNombre];
                const estado = yield this.generarAleatorio(1, 4);
                let disponible = true;
                if (estado !== 2) {
                    disponible = false;
                }
                const lab = yield this.refLab.get();
                const labData = lab.docs.map(dato => dato.data());
                const selLab = yield this.generarAleatorio(1, labData.length);
                const la = labData[selLab];
                const registro = new Date();
                const eqp = {
                    tipo: tipo,
                    nombre: nombre,
                    estado: estado,
                    disponible: disponible,
                    propietario: pertenece,
                    laboratorio: la.id,
                    caracteristicas: {
                        fabricante: 'JasbroMan',
                        modelo: 'Upiiz',
                        serie: '2015-2020',
                        descripcion: 'Puro poder Upiiz jajajjaa Fabroman Recate'
                    },
                    checklist: null,
                    creacion: registro,
                    actualizado: registro
                };
                const addEqp = yield this.refEqp.add(eqp);
                yield this.refEqp.doc(addEqp.id).update({ id: addEqp.id });
            }
            console.log('Fin agregar Equipo');
        });
        // borra la coleccion mesas y la vuelve a crear
        this.generarMesas = () => __awaiter(this, void 0, void 0, function* () {
            const mesas = yield this.refMs.get();
            const data = mesas.docs.map(dato => dato.data());
            if (data.length !== 0) {
                console.log('Borrar ms');
                for (let i in data) {
                    const id = data[i].id;
                    yield this.refMs.doc(id).delete();
                }
            }
            console.log('Crear ms');
            const aleatorio = yield this.generarAleatorio(5, 21);
            const lab = yield this.refLab.get();
            const labData = lab.docs.map(dato => dato.data());
            const usDoc = yield this.refUsr.get();
            const usData = usDoc.docs.map(dato => dato.data());
            for (let x in labData) {
                for (let i = 0; i < aleatorio; i++) {
                    const altUser = yield this.generarAleatorio(0, usData.length);
                    const arraysUs = [];
                    const actual = new Date();
                    for (let y = 0; y < altUser; y++) {
                        const usSel = yield this.generarAleatorio(0, usData.length);
                        const usuario = '' + usData[usSel].id;
                        arraysUs.push({
                            USR: usuario,
                            fecha: actual
                        });
                    }
                    const ms = {
                        nombre: 'mesa' + i,
                        laboratorio: labData[x].id,
                        usuarios: arraysUs,
                        creacion: actual,
                        actualizado: actual
                    };
                    const addMs = yield this.refMs.add(ms);
                    yield this.refMs.doc(addMs.id).update({ id: addMs.id });
                }
            }
            console.log('Fin crear ms');
        });
        // borra la coleccion usuarios y la vuelve a crear
        this.generarUsuarios = () => __awaiter(this, void 0, void 0, function* () {
            const users = yield this.refUsr.get();
            const data = users.docs.map(dato => dato.data());
            if (data.length !== 0) {
                console.log('Borrar us');
                for (let i in data) {
                    const id = data[i].id;
                    if (id !== undefined && id !== null && id !== '') {
                        yield this.refUsr.doc(id).delete();
                    }
                }
            }
            console.log('Crear us');
            const nombres = this.nombres;
            for (let i = 0; i < this.num; i++) {
                const aleatorio = yield this.generarAleatorio(0, nombres.length);
                const nombre = nombres[aleatorio];
                const selecciontipo = yield this.generarAleatorio(1, 5);
                const users = this.usuario;
                let us;
                switch (selecciontipo) {
                    case 1: {
                        us = users.alumno;
                        break;
                    }
                    case 2: {
                        us = users.docente;
                        break;
                    }
                    case 3: {
                        us = users.tecnico;
                        break;
                    }
                    default: {
                        us = users.administrador;
                        break;
                    }
                }
                const lab = yield this.refLab.get();
                const data = lab.docs.map(dato => dato.data());
                const noVetado = yield this.generarAleatorio(0, data.length);
                const arrayVetado = {};
                for (let i = 0; i < noVetado; i++) {
                    const selVetado = yield this.generarAleatorio(0, data.length);
                    const labData = data[selVetado];
                    arrayVetado['' + labData.id] = true;
                }
                const trabajoPosible = yield this.generarAleatorio(0, (data.length / 2));
                const arrayTrabajo = {};
                for (let i = 0; i <= trabajoPosible; i++) {
                    const posible = yield this.generarAleatorio(0, data.length);
                    arrayTrabajo['' + data[posible].id] = true;
                }
                const actual = new Date();
                const usr = {
                    tipo: us.tipo,
                    usuario: us.user,
                    clave: us.pass,
                    nombre: nombre,
                    vetado: arrayVetado,
                    laboratorio: arrayTrabajo,
                    creacion: actual,
                    actualizado: actual
                };
                const addUs = yield this.refUsr.add(usr);
                yield this.refUsr.doc(addUs.id).update({ id: addUs.id });
            }
            console.log('Fin crear us');
        });
        // borra la coleccion laboratorios y la vuelve a crear
        this.generarLaboratorios = () => __awaiter(this, void 0, void 0, function* () {
            const lab = yield this.refLab.get();
            const data = lab.docs.map(dato => dato.data());
            if (data.length !== 0) {
                console.log('Borrar lab');
                for (let i in data) {
                    const id = data[i].id;
                    yield this.refLab.doc(id).delete();
                }
            }
            console.log('Crear lab');
            const lbGeneral = this.nombreLaboratorio;
            const actual = new Date();
            for (let i in lbGeneral) {
                const doc = {
                    edificio: lbGeneral[i][1],
                    nombre: lbGeneral[i][0],
                    creacion: actual,
                    actualizado: actual
                };
                const addLab = yield this.refLab.add(doc);
                yield this.refLab.doc(addLab.id).update({ id: addLab.id });
            }
            console.log('Fin crear lab');
        });
        // genera numero aleatorio dentro de un rango min incluido y max excluido
        this.generarAleatorio = (min, max) => __awaiter(this, void 0, void 0, function* () {
            const aleatorio = Math.random() * (max - min) + min;
            const num = Math.round(aleatorio);
            if (num === max) {
                return num - 1;
            }
            return num;
        });
        this.tipoEquipo = [
            'Maquinaria',
            'Electronica',
            'Tarjeta Programable',
            'Personal'
        ];
        this.nombreEquipo = [
            'Voltímetro',
            'Ohmetro',
            'Amperimetro',
            'Multimetro',
            'Fuente de alimentacion',
            'Generador de señales',
            'Generador de pulsos',
            'Osciloscopio',
            'Frecuencimetro',
            'Cautin',
            'Analizador de redes',
            'Analizador de espectros',
            'Medidores de figura de ruido',
            'Aire acondicionado',
            'Refrigeracion',
            'Calefaccion',
            'Congelador',
            'Cafetera',
            'Computadora',
            'Focos incandescentes',
            'Plancha',
            'Ventilador',
            'Horno',
            'Estufa',
            'Pinzas',
            'Pinzas',
            'Broca',
            'Cizalla',
            'Compás',
            'Destornillador',
            'Llave',
            'Martillo',
            'Punta de trazar',
            'Sierra manual',
            'Tijeras',
            'Cinta metrica',
            'Escuadra',
            'Nivel',
            'Calibre'
        ];
        // array de nombre de laboratorios
        this.nombreLaboratorio = [
            ['Electronica I', 'X'],
            ['Electronica II', 'X'],
            ['Pesados I', 'Y'],
            ['Pesados II', 'Y'],
            ['Fundicion I', 'Z'],
            ['Fundicion II', 'Z'],
        ];
        // array de nombres para el usuario
        this.nombres = [
            'Ida Griego Feliz',
            'Idefonso Germano Luchador',
            'Ignacio Griego Orgulloso',
            'Imanol Vasco Dios',
            'Imelda Germano Poderosa',
            'Iñigo Giergo Orgulloso',
            'Indalecio Vasco Fuerza',
            'Inés Giergo Pura',
            'ACUÑA LOPEZ KAROL JULIANA',
            'ALVARADO PACHECO EDUARDO ALFONSO',
            'ARENALES LOPEZ INGRID LORENA',
            'BARAJAS GOMEZ JULIAN FERLEY',
            'BARRETO RUZ VEYKER ALDAIR',
            'BASTO PICO KAREN DAYANA',
            'BERMUDEZ DELGADO KAREN YULIANA',
            'BUITRAGO LOZANO DANIEL ESTEBAN',
            'CACERES PERALTA SILVIA JULIANA',
            'CORREDOR DURAN KAROL DANIELA',
            'DELGADO CONTRERAS YOHANA',
            'DELGADO SARMIENTO ANGEL DAVID',
            'GAMARRA CARVAJAL ANDRES FELIPE',
            'GAMBOA MOJICA MAUREN JAVIER',
            'GARCIA CABALLERO CAROL DAYANA',
            'GONZALEZ SANDOVAL LAURA DANIELA',
            'GUTIERREZ RODRIGUEZ GABRIELA FERNANDA',
            'HERNANDEZ ASTRO JHONYER DAVID',
            'HERNANDEZ RIVERA EDGAR STEVEN'
        ];
        // array de tipo de usuario
        this.usuario = {
            alumno: {
                user: 'Alumno',
                pass: '12345678',
                tipo: 1
            },
            docente: {
                user: 'docente',
                pass: '12345678',
                tipo: 2
            },
            tecnico: {
                user: 'tecnico',
                pass: '12345678',
                tipo: 3
            },
            administrador: {
                user: 'admin',
                pass: '12345678',
                tipo: 4
            }
        };
        // informacion del usuario upiiz
        this.userUpiiz = {
            tipo: 4,
            usuario: 'Upiiz',
            clave: 'Upiiz',
            nombre: 'Upiiz IPN'
        };
    }
}
exports.default = TestCM;
//# sourceMappingURL=testCM.js.map