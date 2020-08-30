import * as admin from 'firebase-admin'; // importa libreria para conexion con firebase.
import App from './App'; // importa archivo de configuracion para montar API.
import { environment } from './environments/environments'; // importa archivo con credenciales necesarias para crear conexion a firebase

// import de catalogos
import catalogoController from './api/catalogos/catalogo.controller'; // importa controlador de catalogos

console.log('Mode: dev');

// inicializa conexion a firebase
admin.initializeApp({
    credential: admin.credential.cert(environment.getCert()),
    databaseURL: environment.desarrollo.databaseURL
});
admin.firestore().settings({ timestampsInSnapshots: false });

// path general para acceder a API -> ejm: 'http://localhost:3001/API_SREI/'
const path = '/API_SREI';

// se añade controladores a APP para su acceso.
const app = new App(
    [
        new catalogoController(path)
    ]
);

// obtiene la instancia de APP
app.getApp();

// mensaje indicando cuando el servidor esta iniciado
console.log('Servidor iniciado');
