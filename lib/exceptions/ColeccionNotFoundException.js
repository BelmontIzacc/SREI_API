"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = require("./HttpException");
const codigos_1 = require("./codigos");
class ColeccionNotFoundException extends HttpException_1.default {
    constructor(coleccion) {
        super(404, `No se encontro la colección '${coleccion}'`, codigos_1.codigos.datosNoEncontrados);
    }
}
exports.default = ColeccionNotFoundException;
//# sourceMappingURL=ColeccionNotFoundException.js.map