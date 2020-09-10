"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = require("./HttpException");
const codigos_1 = require("./codigos");
class UsuarioNotFoundException extends HttpException_1.default {
    constructor(usuario) {
        super(404, `El usuario con el correo '${usuario}' no existe`, codigos_1.codigos
            .datosNoEncontrados);
    }
}
exports.default = UsuarioNotFoundException;
//# sourceMappingURL=UsuarioNotFoundException.js.map