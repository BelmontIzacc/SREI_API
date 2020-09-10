"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = require("./HttpException");
class DataNotFoundException extends HttpException_1.default {
    constructor(codigo) {
        super(404, 'El documento no fue encontrado', codigo);
    }
}
exports.default = DataNotFoundException;
//# sourceMappingURL=DataNotFoundException.js.map