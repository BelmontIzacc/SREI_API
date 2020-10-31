import * as admin from 'firebase-admin';
import { codigos } from '../../exceptions/codigos';
import { variable } from '../variables';

//import de exceptions
import DataNotFoundException from '../../exceptions/DataNotFoundException';
//import InternalServerException from '../../exceptions/InternalServerException';

// import interfaces
import USR from '../../interfaces/colecciones/USR.interface';

const axios = require('axios');

// client manager, contiene toda la logica del manejo de los datos
export default class UsuariosCM {

    // variables de acceso a db
    private db = admin.firestore();
    private refUs = this.db.collection(variable['usuarios']);

    // Endpoint para registrar o logearse dentro del sistema.
    public ingresar = async (credenciales: any) => {

        // Expresiones regulares para boleta o RFC
        const expRFC = /[A-Z][A-Z][A-Z][A-Z[0-9][0-9][0-9][0-9][0-9][0-9][A-Z][A-Z]/;
        const expBoleta = /[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]/;

        let requestData; // Datos que se envian a la api de la UPIIZ
        let path; // ruta de api de la UPIIZ
        let alumno: Boolean;

        if (expBoleta.test(credenciales.username)) {
            requestData = {
                username: credenciales.username,
                password: credenciales.password
            };

            path = '/pump/web/index.php/login';
            alumno = true;
        } else if (expRFC.test(credenciales.username)) {
            requestData = {
                rfc: credenciales.username,
            };

            path = '/pump/web/index.php/personal';
            alumno = false;
        } else {
            return new DataNotFoundException(codigos.datosNoEncontrados);
        }

        const response = await this.peticionExterna(path, requestData);
        
        const estatus = response.estatus;
        let usr: any = null;

        if (estatus === true) {
            if (alumno) {
                usr = await this.loginUser(credenciales.username);
                if (usr instanceof DataNotFoundException) {
                    const data = response.datos;
                    usr = await this.register(data.boleta, data.Nombre);
                }
            } else {
                usr = await this.loginUserTrabajadores(credenciales.username, credenciales.password);
                if (usr instanceof DataNotFoundException) {
                    console.log("No se encontro usuario");
                }
            }

            console.log("usr: ", usr);
            return usr as USR;
        }
        return new DataNotFoundException(codigos.noEncontradoUsuario);
    }

    // realizar una peticion a un sitio externo
    private peticionExterna = async (path: string, data: any) => {
        let httpResponse: any;

        const url = 'http://148.204.142.2' + path
        const header = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 584423298741328'
            }
        };

        try {
            httpResponse = await axios.post(url, data, header);
        } catch (error) {
            console.error(error.body);
            httpResponse = 'error';
        }

        return httpResponse.data;
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
        console.log(users);
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

    // registro para empleados
    public registrarempleado = async (tipo: number, rfc: string, pass: string, edificio: string) => {
        if (rfc === undefined || rfc === null || rfc === '') {
            return new DataNotFoundException(codigos.datoNoEncontrado);
        }
        if (pass === undefined || pass === null || pass === '') {
            return new DataNotFoundException(codigos.datoNoEncontrado);
        }

        const requestData = {
            rfc: rfc
        };

        const response = await this.peticionExterna('/pump/web/index.php/personal', requestData);
        
        if(response.estatus === true) {
            let usr: any;
            usr = {
                tipo: tipo, // falta verificar
                usuario: rfc,
                clave: pass,
                nombre: response.datos.nombre,
                edificio: edificio, // falta verificar
                id: ''
            };

            const saveUser = await this.refUs.add(usr);
            const key = saveUser.id;
            await saveUser.update({ id: key });
            usr.id = key;

            return usr as USR;
        }

        return new DataNotFoundException(codigos.noEncontradoUsuario);
    }

}
