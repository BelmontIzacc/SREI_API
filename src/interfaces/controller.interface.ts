import { Router } from 'express'; // importa manejador de rutas de express
 
// estructura utilizada para los controladores
interface Controller {
  path: string;
  router: Router;
}
 
export default Controller;