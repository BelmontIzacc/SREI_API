import { Request, Response, Router, NextFunction } from 'express';
import Controller from '../../interfaces/controller.interface';
import TestCM from './testCM';

// controlador para rutas de equipo
class TestController implements Controller {
    public router = Router();
    public path = '/test'; // path principal de acceso a las rutas del controlador

    // imports de classes CM
    private testCM = new TestCM();

    // constructor del controlador
    constructor(pathGeneral: string) {
        this.path = pathGeneral + '' + this.path;
        this.initializeRoutes();
    }

    // Al iniciar el controlador carga las respectivas rutas
    initializeRoutes() {
        this.router.get(this.path + '/generar', this.generarDb);
    }

    private generarDb = async (req: Request, res: Response, next: NextFunction) => {
        await this.testCM.generar();
        res.send({ estatus: true });
    }

}

export default TestController;