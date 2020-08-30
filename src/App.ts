import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as morgan from 'morgan';
import Controller from './interfaces/controller.interface';

class App {
    private app: express.Application;
    private port: number = 3001;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(cors({ origin: true }));
        this.app.use(cookieParser());
        this.app.use(morgan('dev'));
        this.setPort();
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    private setPort() {
        this.app.set('port', process.env.PORT || this.port);
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port ', this.app.get('port'));
        });
    }

    public getApp() {
        return this.app;
    }
}

export default App;
