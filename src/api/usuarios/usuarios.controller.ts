/*
 * autor: ibelmonte
 * modifico: obelmonte
 * fecha de modificacion: 16/12/2020 
 */

import { Request, Response, Router, NextFunction } from 'express';
import InternalServerException from '../../exceptions/InternalServerException';
import DataNotFoundException from '../../exceptions/DataNotFoundException';
import Controller from '../../interfaces/controller.interface';

// import de archivos CM
import UsuariosCM from './usuariosCM';

// controlador para rutas de equipo
class UsuariosController implements Controller {
    public router = Router();
    public path = '/usuarios'; // path principal de acceso a las rutas del controlador

    // imports de classes CM
    private usuariosCM = new UsuariosCM();

    // constructor del controlador
    constructor(pathGeneral: string) {
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
    }

    /*
     * @description Endpoint para registrar o logearse dentro del sistema.
     * @params 
     *   @param  username(username para ingresar), 
     *   @param  password(password para auth)
     * @retuns {estatus:boolean,  usuario: {...} }	
     * @author obelmonte
     */
    private ingresar = async (req: Request, res: Response, next: NextFunction) => {
        const credenciales = req.body;
        const respuesta = await this.usuariosCM.ingresar(credenciales);
        if (respuesta instanceof DataNotFoundException) {
            next(respuesta);
            return;
        }
        res.send({ estatus: true, usuario: respuesta });
    }

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
    private registrarEmpleado = async (req: Request, res: Response, next: NextFunction) => {
        const datos = req.body;
        const respuesta = await this.usuariosCM.registrarEmpleado(datos.tipo, datos.rfc, datos.pass, datos.laboratorio);

        if(respuesta instanceof DataNotFoundException) {
            next(respuesta);
            console.log(respuesta);
            return;
        }

        res.send({ estatus: true, usuario: respuesta});
    }

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
    private cambiarVetado = async (req: Request, res: Response, next: NextFunction) => {
       
        const { usuario_id, vetado, laboratorio_id } = req.body;
        const respuesta = await this.usuariosCM.actualizarVetado(usuario_id, vetado, laboratorio_id);

        if(respuesta instanceof DataNotFoundException ||
           respuesta instanceof InternalServerException) {
           
            res.send(respuesta);
        }

        res.send({
            estatus: true, 
            editado: true,
            usuario: respuesta
        });
    }

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
    private berificarVetado = async (req: Request, res: Response) => {
        const { usuario_id, laboratorio_id} = req.body;
        const vetado = await this.usuariosCM.rebisarVetado(usuario_id, laboratorio_id);

        if(vetado instanceof DataNotFoundException ||
            vetado instanceof InternalServerException) {
            
             res.send(vetado);
        }

        res.send({
            estatus: true,
            vetado
        });
    }
}

export default UsuariosController;