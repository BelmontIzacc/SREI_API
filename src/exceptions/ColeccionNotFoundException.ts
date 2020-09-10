import HttpException from "./HttpException";
import { codigos } from './codigos';

class ColeccionNotFoundException extends HttpException {
  constructor(coleccion: string) {
    super(404, `No se encontro la colección '${coleccion}'`, codigos.datosNoEncontrados);
  }
}

export default ColeccionNotFoundException;