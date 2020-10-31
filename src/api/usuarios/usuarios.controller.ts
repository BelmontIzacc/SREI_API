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

    // Al iniciar el controlador carga las respectivas rutas
    initializeRoutes() {
        this.router.get(this.path + '/login', this.ingresar);
        this.router.post(this.path + '/register', this.registrarEmpleado);
    }

    /*
    * @description Endpoint para registrar o logearse dentro del sistema.
    * @params 
    * @param  username(username para ingresar), password(password para auth)
    * @retuns {estatus:boolean, ingresar: true, eqp: {...} }	
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

    private registrarEmpleado = async (req: Request, res: Response, next: NextFunction) => {
        const datos = req.body;
        const respuesta = await this.usuariosCM.registrarempleado(datos.tipo, datos.rfc, datos.pass, datos.laboratorio);

        if(respuesta instanceof DataNotFoundException) {
            next(respuesta);
            console.log(respuesta);
            return;
        }

        res.send({ estatus: true, usuario: respuesta});
    }

}

export default UsuariosController;