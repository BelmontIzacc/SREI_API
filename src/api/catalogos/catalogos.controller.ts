/*
 *   Versión 1.1
 *   Creado al 10/09/2020
 *   Creado por: IBelmonte
 *   Modificado al: 23/10/2020
 *   Editado por: GBautista
 *   Copyright SReI
 */

import { Request, Response, Router, NextFunction } from 'express';
import Controller from '../../interfaces/controller.interface';

// middleware
import validationMiddleware from '../../middleware/validation.middleware';
import { CrearEquipo, EditarEquipo } from './catalogos.dto';

// import de archivos CM
import CatalogosCM from './catalogosCM';

// import de exceptions
import InternalServerException from '../../exceptions/InternalServerException';
import DataNotFoundException from '../../exceptions/DataNotFoundException';

// controlador para rutas de equipo
class CatalogosController implements Controller {
    public router = Router();
    public path = '/catalogos'; // path principal de acceso a las rutas del controlador

    // imports de classes CM
    private catalogosCM = new CatalogosCM();

    // constructor del controlador
    constructor(pathGeneral: string) {
        this.path = pathGeneral + '' + this.path;
        this.initializeRoutes();
    }

    // Al iniciar el controlador carga las respectivas rutas
    initializeRoutes() {
        this.router.get(this.path + '/equipo/:uid', this.obtenerEquipo);
        this.router.get(this.path + '/equipo/tipo/:tipo', this.obtenerEquipoTipo)
        this.router.put(this.path + '/equipo', validationMiddleware(EditarEquipo, true), this.editarEquipo);
        this.router.delete(this.path + '/equipo/:id', this.eliminarEquipo);
        this.router.post(this.path + '/equipo', validationMiddleware(CrearEquipo, true), this.crearEquipo);
    }

    /*
    * @description Endpoint para retornar un registro de la coleccion EQP.
    * @params uid
    * @param  uid(id del usuario tomado de params) 
    * @retuns {estatus:true/false, eqp: {...} }	
    * @author Belmont
    */
    private obtenerEquipo = async (req: Request, res: Response, next: NextFunction) => {
        const prueba = req.params.uid;
        const respuesta = await this.catalogosCM.obtenerEquipo(prueba);
        if (respuesta instanceof DataNotFoundException) {
            res.send(respuesta);
            return;
        }
        if (respuesta instanceof InternalServerException) {
            res.send(respuesta);
            return;
        }
        res.send({ estatus: true, eqp: respuesta });
    }

    /*
    * @description Endpoint para retornar una sub coleccion de la coleccion EQP.
    * @params tipo
    * @param  tipo(tipo del equipo tomado de params) 
    * @retuns {estatus:Exito/error, eqps: {...} }
    * @author GBautista	
    */
   private obtenerEquipoTipo = async (req: Request, res: Response, next: NextFunction) => {
    const tipo = req.params.tipo;
    const respuesta = await this.catalogosCM.obtenerEquipoTipo(tipo);
    if (respuesta instanceof DataNotFoundException) {
        res.send(respuesta);
        return;
    }
    if (respuesta instanceof InternalServerException) {
        res.send(respuesta);
        return;
    }
    res.send({ estatus: true, eqps: respuesta });
}

    /*
    * @description Endpoint para editar un registro de la coleccion EQP.
    * @params id,tipo,nombre,estado,disponible,propietario,caracteristicas, checklist
    * @param  id(id del registro), tipo(tipo del equipo), nombre(nombre del equipo), estado(indica el estado del equipo),
    * disponible(indica si se encuentra disponible), propietario(dueño del equipo UPIIZ), 
    * caracteristicas(Arreglo en el que se especifican características generales del equipo),
    * checklist(Array solo está presente en la maquinaria)
    * @retuns {estatus:Exito/error, editado: true, eqp: {...} }	
    * @author Belmont
    */
    private editarEquipo = async (req: Request, res: Response, next: NextFunction) => {
        const eqp = req.body;
        const respuesta = await this.catalogosCM.editarEquipo(eqp);
        if (respuesta instanceof DataNotFoundException) {
            res.send(respuesta);
            return;
        }
        if (respuesta instanceof InternalServerException) {
            res.send(respuesta);
            return;
        }
        res.send({ estatus: true, editado: true, eqp: respuesta });
    }

    /*
    * @description Endpoint para eliminar un registro de la coleccion EQP.
    * @params id
    * @param  id(id del registro tomado de params)
    * @retuns {estatus:Exito/error, eliminado: true, eqp: '...' }
    * @author Belmont
    */
    private eliminarEquipo = async (req: Request, res: Response, next: NextFunction) => {
        const key = req.params.id;
        const respuesta = await this.catalogosCM.eliminarEquipo(key);
        if (respuesta instanceof DataNotFoundException) {
            res.send(respuesta);
            return;
        }
        if (respuesta instanceof InternalServerException) {
            res.send(respuesta);
            return;
        }
        res.send({ estatus: true, eliminado: true, eqp: respuesta });
    }

    /*
    * @description Endpoint para crear un registro en la coleccion EQP.
    * @params id,tipo,nombre,estado,disponible,propietario,caracteristicas, checklist
    * @param  id(id del registro), tipo(tipo del equipo), nombre(nombre del equipo), estado(indica el estado del equipo),
    * disponible(indica si se encuentra disponible), propietario(dueño del equipo UPIIZ), 
    * caracteristicas(Arreglo en el que se especifican características generales del equipo),
    * checklist(Array solo está presente en la maquinaria)
    * @retuns {estatus:Exito/error, creado: true, eqp: {...} }	
    * @author Belmont
    */
    private crearEquipo = async (req: Request, res: Response, next: NextFunction) => {
        const eqp = req.body;
        const respuesta = await this.catalogosCM.crearEquipo(eqp);
        if (respuesta instanceof DataNotFoundException) {
            res.send(respuesta);
            return;
        }
        if (respuesta instanceof InternalServerException) {
            res.send(respuesta);
            return;
        }
        res.send({ estatus: true, creado: true, eqp: respuesta });
    }

}

export default CatalogosController;