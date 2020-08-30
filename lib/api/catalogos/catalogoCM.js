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
const admin = require("firebase-admin");
const variables_1 = require("../variables");
class CatalogoCM {
    constructor() {
        this.db = admin.firestore();
        this.refTest = this.db.collection(variables_1.variable['tester']);
        this.test = (test) => __awaiter(this, void 0, void 0, function* () {
            const res = yield this.refTest.get()
                .then(data => {
                if (data.empty) {
                    return 'nada';
                }
                const d = data.docs.map(dato => dato.data());
                return d;
            })
                .catch(err => {
                return err;
            });
            return res;
        });
    }
}
exports.default = CatalogoCM;
//# sourceMappingURL=catalogoCM.js.map