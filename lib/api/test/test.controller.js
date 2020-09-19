"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const testCM_1 = require("./testCM");
// controlador para rutas de equipo
class TestController {
    // constructor del controlador
    constructor(pathGeneral) {
        this.router = express_1.Router();
        this.path = '/test'; // path principal de acceso a las rutas del controlador
        // imports de classes CM
        this.testCM = new testCM_1.default();
        this.generarDb = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            yield this.testCM.generar();
            res.send({ estatus: true });
        });
        this.path = pathGeneral + '' + this.path;
        this.initializeRoutes();
    }
    // Al iniciar el controlador carga las respectivas rutas
    initializeRoutes() {
        this.router.get(this.path + '/generar', this.generarDb);
    }
}
exports.default = TestController;
//# sourceMappingURL=test.controller.js.map