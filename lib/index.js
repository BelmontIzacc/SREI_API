"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin"); // importa libreria para conexion con firebase.
const App_1 = require("./App"); // importa archivo de configuracion para montar API.
const environments_1 = require("./environments/environments"); // importa archivo con credenciales necesarias para crear conexion a firebase
// import de catalogos
const catalogos_controller_1 = require("./api/catalogos/catalogos.controller"); // importa controlador de catalogos
console.log('Mode: dev');
// inicializa conexion a firebase
admin.initializeApp({
    credential: admin.credential.cert(environments_1.environment.getCert()),
    databaseURL: environments_1.environment.desarrollo.databaseURL
});
admin.firestore().settings({ timestampsInSnapshots: false });
// path general para acceder a API -> ejm: 'http://localhost:3001/API_SREI/'
const path = '/API_SREI';
// se añade controladores a APP para su acceso.
const app = new App_1.default([
    new catalogos_controller_1.default(path)
]);
// obtiene la instancia de APP
app.getApp();
// mensaje indicando cuando el servidor esta iniciado
console.log('Servidor iniciado');
//# sourceMappingURL=index.js.map