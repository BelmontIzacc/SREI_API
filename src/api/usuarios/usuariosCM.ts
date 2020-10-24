import * as admin from 'firebase-admin';
import { codigos } from '../../exceptions/codigos';
import { variable } from '../variables';
import requestPromise = require("request-promise");

// import de exceptions
import DataNotFoundException from '../../exceptions/DataNotFoundException';
import InternalServerException from '../../exceptions/InternalServerException';

// import interfaces
import USR from '../../interfaces/colecciones/USR.interface';

// client manager, contiene toda la logica del manejo de los datos
export default class UsuariosCM {
    // variables de acceso a db
    private db = admin.firestore();
    private refUs = this.db.collection(variable['usuarios']);

    // Endpoint para registrar o logearse dentro del sistema.
    public ingresar = async (credenciales: any) => {
        const expRFC = /[A-Z][A-Z][A-Z][A-Z[0-9][0-9][0-9][0-9][0-9][0-9][A-Z][A-Z]/;
        const expBoleta = /[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]/;
        let reqData;
        let path;
        let operacion;  // Si es 0 loguea a un alumno // Si es 1 loguea a un trabajador // Si es 2 registra a un trabajador
        if (expBoleta.test(credenciales.username)) {
            reqData = {
                username: credenciales.username,
                password: credenciales.password
            };
            path = '/pump/web/index.php/login';
            operacion = 0;
        } else if (expRFC.test(credenciales.username)) {
            reqData = {
                rfc: credenciales.username,
            };
            path = '/pump/web/index.php/personal';
            operacion = (Object.keys(credenciales).length == 2) ? 1 : 2;
        } else {
            return new DataNotFoundException(codigos.datosNoEncontrados);
        }
        const respuesta = await this.peticionExterna(path);
        const res = JSON.parse(respuesta);
        const estatus = res.estatus;
        let usr: any = null;
        if (estatus) {
            if (operacion == 0) {
                usr = await this.loginUser(credenciales.username);
                if (JSON.stringify(usr) == '[]') {
                    usr = await this.register(credenciales.username, res.nombre);
                }
            } else {
                usr = (operacion == 1) ?
                    await this.loginUserTrabajadores(credenciales.username, credenciales.password) :
                    await this.registrarDoc(credenciales.username, credenciales.password, res.nombre);
            }
            console.log("usr: ", usr);
            return usr as USR;
        }
        return new DataNotFoundException(codigos.noEncontradoUsuario);
    }

    // realizar una peticion a un sitio externo
    private peticionExterna = async (path: string) => {
        const http = await requestPromise.post({
            uri: '148.204.142.2/' + path,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 584423298741328'
            },
            json: true
        }).then(data => {
            return data;
        }).catch(err => {
            return new InternalServerException(codigos.datoNoEncontrado, err);
        });
        return http;
    }

    // login de usuario
    private loginUser = async (boleta: string) => {
        if (boleta === undefined || boleta === null || boleta === '') {
            return new DataNotFoundException(codigos.datoNoEncontrado);
        }
        const us = await this.refUs.where('usuario', '==', boleta).get();
        if (us.empty) {
            return new DataNotFoundException(codigos.noEncontradoUsuario);
        }
        const users = us.docs.map(data => data.data()) as USR[];
        return users[0]; // parte de la teoria que solo existe un usuario con la boleta indicada
    }

    // login de trabajadores
    private loginUserTrabajadores = async (rfc: string, password: string) => {
        if (rfc === undefined || rfc === null || rfc === '') {
            return new DataNotFoundException(codigos.datoNoEncontrado);
        }
        if (password === undefined || password === null || password === '') {
            return new DataNotFoundException(codigos.datoNoEncontrado);
        }
        const us = await this.refUs.where('usuario', '==', rfc).where('clave', '==', password).get();
        if (us.empty) {
            return new DataNotFoundException(codigos.noEncontradoUsuario);
        }
        const users = us.docs.map(data => data.data()) as USR[];
        return users[0]; // parte de la teoria que solo existe un usuario con el rfc y la clave
    }

    // registra un usuario
    private register = async (boleta: string, nombre: string) => {
        if (boleta === undefined || boleta === null || boleta === '') {
            return new DataNotFoundException(codigos.datoNoEncontrado);
        }
        const usr = {
            tipo: 0,
            usuario: boleta,
            nombre: nombre,
            id: ''
        };
        const saveUser = await this.refUs.add(usr);
        const key = saveUser.id;
        await saveUser.update({ id: key });
        usr.id = key;
        return usr;
    }

    // registro para docentes
    private registrarDoc = async (rfc: string, pass: string, nombre: string) => {
        if (rfc === undefined || rfc === null || rfc === '') {
            return new DataNotFoundException(codigos.datoNoEncontrado);
        }
        if (pass === undefined || pass === null || pass === '') {
            return new DataNotFoundException(codigos.datoNoEncontrado);
        }
        const usr = {
            tipo: data.tipo, // falta verificar
            usuario: rfc,
            clave: pass,
            nombre: nombre,
            edificio: data.edificio, // falta verificar
            id: ''
        };
        const saveUser = await this.refUs.add(usr);
        const key = saveUser.id;
        await saveUser.update({ id: key });
        usr.id = key;
        return usr;
    }

}
