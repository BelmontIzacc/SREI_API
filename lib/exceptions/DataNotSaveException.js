"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataNotSaveException = void 0;
const HttpException_1 = require("./HttpException");
class DataNotSaveException extends HttpException_1.default {
    constructor(codigo) {
        super(400, 'Error al guardar los datos', codigo);
    }
}
exports.DataNotSaveException = DataNotSaveException;
exports.default = DataNotSaveException;
//# sourceMappingURL=DataNotSaveException.js.map