"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = require("./HttpException");
class BadRequestException extends HttpException_1.default {
    constructor(message) {
        super(400, message);
    }
}
exports.default = BadRequestException;
//# sourceMappingURL=BadRequestException.js.map