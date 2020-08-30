import * as admin from 'firebase-admin';

import App from './App';
import { environment } from './environments/environments';
import catalogoController from './api/catalogos/catalogo.controller';

console.log('Mode: dev');

admin.initializeApp({
    credential: admin.credential.cert(environment.getCert()),
    databaseURL: environment.desarrollo.databaseURL
  });

admin.firestore().settings({ timestampsInSnapshots: false });

const app = new App(
    [
        new catalogoController()
    ]
);

app.getApp();

console.log('Servidor iniciado');
