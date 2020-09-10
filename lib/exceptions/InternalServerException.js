"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = require("./HttpException");
const codigos_1 = require("./codigos");
class InternalServerException extends HttpException_1.default {
    constructor(mesage, object) {
        super(500, mesage, codigos_1.codigos.indefinido, object);
    }
}
exports.default = InternalServerException;
//# sourceMappingURL=InternalServerException.js.map