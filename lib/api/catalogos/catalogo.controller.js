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
const catalogoCM_1 = require("./catalogoCM");
class catalogoController {
    constructor(pathGeneral) {
        this.router = express_1.Router();
        this.path = '/catalogo';
        this.catalogoCM = new catalogoCM_1.default();
        this.test = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const prueba = req.body.prueba;
            const respuesta = yield this.catalogoCM.test(prueba);
            res.send({ estatus: respuesta });
        });
        this.path = pathGeneral + '' + this.path;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path + '/test', this.test);
    }
}
exports.default = catalogoController;
//# sourceMappingURL=catalogo.controller.js.map