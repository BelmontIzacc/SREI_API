import * as admin from 'firebase-admin';
import { variable } from '../variables';
import LAB from '../../interfaces/colecciones/LAB.interface';
import USR from '../../interfaces/colecciones/USR.interface';
import MS from '../../interfaces/colecciones/MS.interface';
import EQP from '../../interfaces/colecciones/EQP.interface';
import MNT from '../../interfaces/colecciones/MNT.interface';
import PRT from '../../interfaces/colecciones/PRT.interface';

// client manager, contiene toda la logica del manejo de los datos
// todo esto esta todo rudimentario y feo xD no le hagan caso solo es para llenar la base de datos
export default class TestCM {
    // variables de acceso a db
    private db = admin.firestore();
    // numero de registros
    private num = 500;
    private refUsr = this.db.collection(variable['usuarios']);
    private refLab = this.db.collection(variable['laboratorio']);
    private refMs = this.db.collection(variable['mesas']);
    private refEqp = this.db.collection(variable['equipo']);
    private refMnt = this.db.collection(variable['mantenimientos']);
    private refPrt = this.db.collection(variable['prestamos']);

    // generar colecciones y datos para la db
    public generar = async () => {
        await this.generarLaboratorios();
        await this.generarUsuarios();
        await this.generarMesas();
        await this.generarEqp();
        await this.generarMnt();
        await this.generarPrestamo();
    }

    private generarPrestamo = async () => {
        const prestamo = await this.refPrt.get();
        const data = prestamo.docs.map(dato => dato.data()) as PRT[];
        if (data.length !== 0) {
            console.log('Borrar Prestamo');
            for (let i in data) {
                const id = data[i].id;
                await this.refPrt.doc(id).delete();
            }
        }
        console.log('Crear Prestamo');
        const total = this.num * 3;

        const equipo = await this.refEqp.get();
        const dataEqp = equipo.docs.map(dato => dato.data()) as EQP[];

        const mesas = await this.refMs.get();
        const dataMesa = mesas.docs.map(dato => dato.data()) as MS[];

        for (let i = 0; i < total; i++) {
            const seleccionar = await this.generarAleatorio(0, dataEqp.length);
            const eqp = dataEqp[seleccionar];
            const dis = eqp.disponible;
            const actual = new Date();
            const selMesa = await this.generarAleatorio(0, dataMesa.length);
            const mesa = dataMesa[selMesa];
            if (mesa.usuarios.length !== 0) {
                const selUserMesa = await this.generarAleatorio(1, mesa.usuarios.length);
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
                    const addPre = await this.refPrt.add(pre);
                    await this.refPrt.doc(addPre.id).update({ id: addPre.id });
                }
            }
        }
        console.log('Termino prestamo');
    }

    // borra la coleccion mantenimiento y la vuelve a crear
    private generarMnt = async () => {
        const mante = await this.refMnt.get();
        const data = mante.docs.map(dato => dato.data()) as MNT[];
        if (data.length !== 0) {
            console.log('Borrar Mnt');
            for (let i in data) {
                const id = data[i].id;
                await this.refMnt.doc(id).delete();
            }
        }
        console.log('Crear Mnt');
        const cantidad = await this.generarAleatorio(20, this.num);
        const equipo = await this.refEqp.get();
        const dataEqp = equipo.docs.map(dato => dato.data()) as EQP[];
        for (let i = 0; i < cantidad; i++) {
            const elegirRegistro = await this.generarAleatorio(1, dataEqp.length);
            const eqp = dataEqp[elegirRegistro];
            const actual = new Date();
            const estado = eqp.estado;
            if (estado !== 2) {
                let fin: any = null;
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
                const addMnt = await this.refMnt.add(mnt);
                await this.refMnt.doc(addMnt.id).update({ id: addMnt.id });
            }
        }
        console.log('Termino crear Mnt');
    }

    // borra la coleccion equipo y la vuelve a crear
    private generarEqp = async () => {
        const equipo = await this.refEqp.get();
        const data = equipo.docs.map(dato => dato.data()) as EQP[];
        if (data.length !== 0) {
            console.log('Borrar eqp');
            for (let i in data) {
                const id = data[i].id;
                if (id !== undefined && id !== null) {
                    await this.refEqp.doc(id).delete();
                }
            }
        }
        console.log('Crear eqp');
        const superUs = await this.refUsr.add(this.userUpiiz);
        const actual = new Date();
        await this.refUsr.doc(superUs.id).update({ creacion: actual, actualizado: actual, id: superUs.id });
        const usDoc = await this.refUsr.get();
        const usData = usDoc.docs.map(dato => dato.data()) as USR[];
        for (let i = 0; i < this.num; i++) {
            const probabiliadPertenece = await this.generarAleatorio(0, 6);
            let pertenece = '';
            if (probabiliadPertenece === 3) {
                const user = await this.generarAleatorio(0, usData.length);
                pertenece = '' + usData[user].id;
            }
            pertenece = '' + superUs.id;
            const alTipo = await this.generarAleatorio(0, this.tipoEquipo.length);
            const tipo = this.tipoEquipo[alTipo];
            const alNombre = await this.generarAleatorio(0, this.nombreEquipo.length);
            const nombre = this.nombreEquipo[alNombre];
            const estado = await this.generarAleatorio(1, 4);
            let disponible = true;
            if (estado !== 2) {
                disponible = false;
            }
            const lab = await this.refLab.get();
            const labData = lab.docs.map(dato => dato.data()) as LAB[];
            const selLab = await this.generarAleatorio(1, labData.length);
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
            const addEqp = await this.refEqp.add(eqp);
            await this.refEqp.doc(addEqp.id).update({ id: addEqp.id });
        }
        console.log('Fin agregar Equipo');
    }

    // borra la coleccion mesas y la vuelve a crear
    private generarMesas = async () => {
        const mesas = await this.refMs.get();
        const data = mesas.docs.map(dato => dato.data()) as MS[];
        if (data.length !== 0) {
            console.log('Borrar ms');
            for (let i in data) {
                const id = data[i].id;
                await this.refMs.doc(id).delete();
            }
        }
        console.log('Crear ms');
        const aleatorio = await this.generarAleatorio(5, 21);
        const lab = await this.refLab.get();
        const labData = lab.docs.map(dato => dato.data()) as LAB[];
        const usDoc = await this.refUsr.get();
        const usData = usDoc.docs.map(dato => dato.data()) as USR[];
        for (let x in labData) {
            for (let i = 0; i < aleatorio; i++) {
                const altUser = await this.generarAleatorio(0, usData.length);
                const arraysUs: Array<any> = [];
                const actual = new Date();
                for (let y = 0; y < altUser; y++) {
                    const usSel = await this.generarAleatorio(0, usData.length);
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
                const addMs = await this.refMs.add(ms);
                await this.refMs.doc(addMs.id).update({ id: addMs.id });
            }
        }
        console.log('Fin crear ms');
    }

    // borra la coleccion usuarios y la vuelve a crear
    private generarUsuarios = async () => {
        const users = await this.refUsr.get();
        const data = users.docs.map(dato => dato.data()) as USR[];
        if (data.length !== 0) {
            console.log('Borrar us');
            for (let i in data) {
                const id = data[i].id;
                if (id !== undefined && id !== null && id !== '') {
                    await this.refUsr.doc(id).delete();
                }
            }
        }
        console.log('Crear us');
        const nombres = this.nombres;
        for (let i = 0; i < this.num; i++) {
            const aleatorio = await this.generarAleatorio(0, nombres.length);
            const nombre = nombres[aleatorio];
            const selecciontipo = await this.generarAleatorio(1, 5);
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
            const lab = await this.refLab.get();
            const data = lab.docs.map(dato => dato.data()) as LAB[];
            const noVetado = await this.generarAleatorio(0, data.length);
            const arrayVetado: any = {};
            for (let i = 0; i < noVetado; i++) {
                const selVetado = await this.generarAleatorio(0, data.length);
                const labData = data[selVetado];
                arrayVetado['' + labData.id] = true;
            }
            const trabajoPosible = await this.generarAleatorio(0, (data.length / 2));
            const arrayTrabajo: any = {};
            for (let i = 0; i <= trabajoPosible; i++) {
                const posible = await this.generarAleatorio(0, data.length);
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
            const addUs = await this.refUsr.add(usr);
            await this.refUsr.doc(addUs.id).update({ id: addUs.id });
        }
        console.log('Fin crear us');
    }

    // borra la coleccion laboratorios y la vuelve a crear
    private generarLaboratorios = async () => {
        const lab = await this.refLab.get();
        const data = lab.docs.map(dato => dato.data()) as LAB[];
        if (data.length !== 0) {
            console.log('Borrar lab');
            for (let i in data) {
                const id = data[i].id;
                await this.refLab.doc(id).delete();
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
            const addLab = await this.refLab.add(doc);
            await this.refLab.doc(addLab.id).update({ id: addLab.id });
        }
        console.log('Fin crear lab');
    }

    // genera numero aleatorio dentro de un rango min incluido y max excluido
    private generarAleatorio = async (min: number, max: number) => {
        const aleatorio = Math.random() * (max - min) + min;
        const num = Math.round(aleatorio);
        if (num === max) {
            return num - 1;
        }
        return num;
    }

    private tipoEquipo = [
        'Maquinaria',
        'Electronica',
        'Tarjeta Programable',
        'Personal'
    ];

    private nombreEquipo = [
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
    private nombreLaboratorio = [
        ['Electronica I', 'X'],
        ['Electronica II', 'X'],
        ['Pesados I', 'Y'],
        ['Pesados II', 'Y'],
        ['Fundicion I', 'Z'],
        ['Fundicion II', 'Z'],
    ];

    // array de nombres para el usuario
    private nombres = [
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
    private usuario = {
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
    private userUpiiz = {
        tipo: 4,
        usuario: 'Upiiz',
        clave: 'Upiiz',
        nombre: 'Upiiz IPN'
    }
}
