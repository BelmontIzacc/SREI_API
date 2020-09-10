import HttpException from "./HttpException";
import { codigos } from './codigos';
 
class UsuarioNotFoundException extends HttpException {
  constructor(usuario: string) {
    super(404, `El usuario con el correo '${usuario}' no existe`, codigos
    .datosNoEncontrados);
  }
}
 
export default UsuarioNotFoundException;