/*
 * autor: ibelmonte
 * modifico: obelmonte
 * fecha de modificacion: 16/12/2020 
 */

import { Request, Response, Router, NextFunction } from 'express';
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

}

export default UsuariosController;