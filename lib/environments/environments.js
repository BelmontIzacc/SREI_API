"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const cer_dev_1 = require("./cert/cer-dev"); // importa archivo de configuracion de enlace firebase
const cer_firebase_1 = require("./cert/cer-firebase"); // importa archivo de confifuracion de aut para firebase
exports.environment = {
    version: "1.0.0",
    desarrollo: {
        credencial: cer_dev_1.default,
        serviceAccount: cer_firebase_1.default,
        databaseURL: 'https://srei-dc583.firebaseio.com'
    },
    getCert: () => {
        return exports.environment.desarrollo.serviceAccount;
    },
};
//# sourceMappingURL=environments.js.map