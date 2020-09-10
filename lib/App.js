"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// importaciones necesarias para funcionamiento de API
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
// clase APP para setear configuracion de API
class App {
    // constructor para creacion de API donde intancia todos los endpoints creados.
    constructor(controllers) {
        // puerto por el cual estara escuchando API
        this.port = 3001;
        this.app = express();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }
    // inicializa middlewares
    initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(cors({ origin: true }));
        this.app.use(cookieParser());
        this.app.use(morgan('dev'));
        this.setPort();
    }
    // inicializa inicia e instancia los controladores creados
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }
    // coloca el puerto a utilizar para API
    setPort() {
        this.app.set('port', process.env.PORT || this.port);
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port ', this.app.get('port'));
        });
    }
    // obtiene toda la intancia de APP creada
    getApp() {
        return this.app;
    }
}
exports.default = App;
//# sourceMappingURL=App.js.map