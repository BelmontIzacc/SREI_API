import { Request, Response, Router, NextFunction } from 'express';
import Controller from '../../interfaces/controller.interface';
import CatalogoCM from './catalogoCM';

class catalogoController implements Controller {
    public router = Router();
    public path = '/catalogo';

    private catalogoCM = new CatalogoCM();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(this.path + '/test', this.test);
    }

    private test = async (req: Request, res: Response, next: NextFunction) => {
        const prueba = req.body.prueba;
        const respuesta = await this.catalogoCM.test(prueba);
        res.send({ estatus: respuesta });
    }
}

export default catalogoController;