/*
 * autor: ibelmonte
 * modifico: obelmonte
 * fecha de modificacion: 16/12/2020 
 */

import * as admin from 'firebase-admin';
import { codigos } from '../../exceptions/codigos';
import { variable } from '../variables';

//import de exceptions
import DataNotFoundException from '../../exceptions/DataNotFoundException';
import InternalServerException from '../../exceptions/InternalServerException';

// import interfaces
import USR from '../../interfaces/colecciones/USR.interface';

const axios = require('axios');

// client manager, contiene toda la logica del manejo de los datos
export default class UsuariosCM {

    // variables de acceso a db
    private db = admin.firestore();
    private refUs = this.db.collection(variable['usuarios']);

    /*
     * @description Endpoint para registrar o logearse dentro del sistema.
     * @params 
     *   @param  username(username para ingresar)
     *   @param  password(password para auth)
     * @retuns {usr: {...} }	
     * @author obelmonte
     */
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

    /*
     * @description Realiza una consulta a la API de la escuela
     * @params 
     *   @param  path(ruta de API de la escuela, existe una para alumnos y otra para trabajadores)
     *   @param  data(datos de autenticacion del SAES del ususario)
     * @retuns {estatus:boolean, datos: {...} }	
     * @author obelmonte
     */
    private peticionExterna = async (path: string, data: any) => {
        let httpResponse: any;

        const url = 'http://148.204.142.2' + path;
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

    /*
     * @description Recupera los datos del usuario de la base de datos
     * @params 
     *   @param  boleta(identificador del usuario dentro de la base de datos)
     * @retuns { ... }	
     * @author obelmonte
     */
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

    /*
     * @description Recupera los datos de un trabajador de la base de datos
     * @params 
     *   @param  rfc(identificador del usuario dentro de la base de datos)
     *   @param  password(contraseña de acceso dentro de la base de datos)
     * @retuns { ... }	
     * @author obelmonte
     */
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

    /*
     * @description Registra un alumno a la base de datos
     * @params 
     *   @param  boleta(identificador del alumno dentro de la base de datos)
     *   @param  nombre(nombre de usuario registrado)
     * @retuns { ... }	
     * @author obelmonte
     */
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
    public registrarEmpleado = async (tipo: number, rfc: string, pass: string, edificio: string) => {
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

    public obtenerUsuario = async (id: string) => {
       
        const registro = await this.refUs.doc(id).get()
            .then((data) => {
                if(data.exists) {
                    const document = data.data() as USR;

                    return document
                }
                return new DataNotFoundException(codigos.datosNoEncontrados);
            }).catch((error) => {
                return new InternalServerException(codigos.datoNoEncontrado);
            });

        return registro;
    }

     /*
     * @description cambio del esatdo de vetado de un usuario a los lavoratorios dentro del sistema
     * @params
     *   @param id(id del usuario que será modificado)
     *   @param vetado(booleano del estado de vetado del usuario)
     * @returns  { ... }
     * @author obelmonte
     */
    public actualizarVetado = async (usuario_id: string, vetado: Boolean, laboratorio_id: string) => {
        if(usuario_id === undefined || usuario_id === null || usuario_id === ''
        || laboratorio_id === undefined || laboratorio_id === null || laboratorio_id === '') {
            return new DataNotFoundException(codigos.identificadorInvalido);
        }

        const usuario = await this.obtenerUsuario(usuario_id);

        if(usuario instanceof DataNotFoundException || usuario instanceof InternalServerException){
            return usuario;
        }

        let vetados = usuario.vetado;
        try {
            vetados[laboratorio_id] = vetado;
        } catch(error) {
            vetados = {};

            vetados[laboratorio_id] = vetado;
        }

        const datos = {
            vetado: vetados,
            actualizado: admin.firestore.Timestamp.now().toDate()
        };
        //const usuario = await this.refUs.where('id', '==', id).get();
        const actualizado = await this.refUs.doc(usuario_id).update(datos)
            .then(async () => {
                const editado = await this.obtenerUsuario(usuario_id);

                return editado;
            })
            .catch(err => {
                return new InternalServerException(codigos.datoNoEncontrado, err);
            });

        return actualizado;
    }

    /*
     * @description obtencion del estado de vetado de un usuario
     * @params
     *   @param id(id del usuario que será consultado)
     * @returns  true/false
     * @author obelmonte
     */
    public rebisarVetado = async (usuario_id: string, laboratorio_id: string) => {
        if(usuario_id === undefined || usuario_id === null || usuario_id === ''
        || laboratorio_id === undefined || laboratorio_id === null || laboratorio_id === '') {
            return new DataNotFoundException(codigos.identificadorInvalido);
        }

        const registro = await  this.obtenerUsuario(usuario_id);
        
        if(registro instanceof DataNotFoundException || 
           registro instanceof InternalServerException) {
            return registro;
        }

        const vetado = new Map(Object.entries(registro.vetado));

        return vetado.get(laboratorio_id);
    }

    /*
     * @description busca todos los usuarios de un tipo especifico
     * @params 
     *   @param  tipo(valor numerico correspondiente al tipo del grupo de usuaios a consultar)
     * @retuns {usuarios: [{...}, ...] }
     * @author obelmonte
     */
    public grupoUsuarios = async (tipo: number) => {
        const elements: USR[] | PromiseLike<USR[]> = [];
        
        console.log(tipo);
        if(tipo === undefined || tipo === null || tipo < 0 || tipo > 3) {
            return new DataNotFoundException(codigos.datosNoEncontrados);
        }

        const usuarios = await this.refUs.where('tipo', '==', tipo).get().then(data => {
            if (!data.empty){
                for (let index = 0; index < data.size; index++) {
                    if (data.docs[index].exists){
                        elements[index] = data.docs[index].data() as USR;
                    }else{
                        return new DataNotFoundException(codigos.datoNoEncontrado);
                    }
                }
                return elements;
            }
            return new DataNotFoundException(codigos.datoNoEncontrado);
        }).catch(err=>{
            return new InternalServerException(codigos.datoNoEncontrado, err);
        });

        return usuarios;
    }

    public testLogin = async (usuario: string, clave: string) => {
        if(usuario === undefined || usuario  === null||clave === undefined || clave === null){
           return new DataNotFoundException(codigos.datosNoEncontrados);
        }

        const us = await  this.refUs.where('usuario','==', usuario).where('clave','==', clave).get();

        if(us ===  undefined || us ===  null) {
            return  new DataNotFoundException(codigos.datoNoEncontrado);
        }

        return us.docs[0].data() as USR;
    }
}
