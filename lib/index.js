"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const App_1 = require("./App");
const environments_1 = require("./environments/environments");
const catalogo_controller_1 = require("./api/catalogos/catalogo.controller");
console.log('Mode: dev');
admin.initializeApp({
    credential: admin.credential.cert(environments_1.environment.getCert()),
    databaseURL: environments_1.environment.desarrollo.databaseURL
});
admin.firestore().settings({ timestampsInSnapshots: false });
const app = new App_1.default([
    new catalogo_controller_1.default()
]);
app.getApp();
console.log('Servidor iniciado');
//# sourceMappingURL=index.js.map