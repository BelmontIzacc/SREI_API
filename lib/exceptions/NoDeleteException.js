"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoDeleteException = void 0;
const HttpException_1 = require("./HttpException");
class NoDeleteException extends HttpException_1.default {
    constructor(codigo) {
        super(403, 'No se pudo eliminar elemento', codigo);
    }
}
exports.NoDeleteException = NoDeleteException;
exports.default = NoDeleteException;
//# sourceMappingURL=NoDeleteException.js.map