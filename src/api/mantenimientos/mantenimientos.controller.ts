/*
 *   Versión 1.0
 *   Creado al 21/09/2020
 *   Creado por: GBautista
 *   Modificado al: 23/10/2020
 *   Editado por: GBautista
 *   Copyright SReI
 */

import { Request, Response, Router, NextFunction } from 'express';
import Controller from '../../interfaces/controller.interface';

// import de archivos CM
import MantenimientosCM from './mantenimientosCM';

// import de exceptions
import InternalServerException from '../../exceptions/InternalServerException';
import DataNotFoundException from '../../exceptions/DataNotFoundException';

// controlador para rutas de equipo
class MantenimientosController implements Controller {
    public router = Router();
    public path = '/mantenimientos'; // path principal de acceso a las rutas del controlador

    // imports de classes CM
    private mantenimientosCM = new MantenimientosCM();

    // constructor del controlador
    constructor(pathGeneral: string) {
        this.path = pathGeneral + '' + this.path;
        this.initializeRoutes();
    }

    // Al iniciar el controlador carga las respectivas rutas
    initializeRoutes() {
        this.router.get(this.path + '/equipo/:idm', this.obtenerMantenimiento);
        this.router.get(this.path + '/lab/:lab', this.obtenerMantenimientosLab);
    }

    /*
    * @description Endpoint para retornar un registro de la coleccion MNT.
    * @params idm
    * @param  idm(id del mantenimiento tomado de params) 
    * @retuns {estatus:true/false, mnt: {...} }	
    * @author GBautista
    */
    private obtenerMantenimiento = async (req: Request, res: Response, next: NextFunction) => {
        const prueba = req.params.idm;
        const respuesta = await this.mantenimientosCM.obtenerMantenimiento(prueba);
        if (respuesta instanceof DataNotFoundException) {
            res.send(respuesta);
            return;
        }
        if (respuesta instanceof InternalServerException) {
            res.send(respuesta);
            return;
        }
        res.send({ estatus: true, mnt: respuesta });
    }

    /*
    * @description Endpoint para retornar una sub coleccion de la coleccion MNT.
    * @params lab
    * @param  lab(laboratorio del mantenimiento tomado de params) 
    * @retuns {estatus:true/false, mnts: {...} }
    * @author GBautista	
    */
    private obtenerMantenimientosLab = async (req: Request, res: Response, next: NextFunction) => {
        const lab = req.params.lab;
        const respuesta = await this.mantenimientosCM.obtenerLabMNT(lab);
        if (respuesta instanceof DataNotFoundException) {
            res.send(respuesta);
            return;
        }
        if (respuesta instanceof InternalServerException) {
            res.send(respuesta);
            return;
        }
        res.send({ estatus: true, mnts: respuesta });
    }
}

export default MantenimientosController;