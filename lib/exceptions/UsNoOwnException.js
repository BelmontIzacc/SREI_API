"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = require("./HttpException");
class UsNoOwnException extends HttpException_1.default {
    constructor(codigo) {
        super(401, 'No tiene propiedad sobre la información que se intenta acceder', codigo);
    }
}
exports.default = UsNoOwnException;
//# sourceMappingURL=UsNoOwnException.js.map