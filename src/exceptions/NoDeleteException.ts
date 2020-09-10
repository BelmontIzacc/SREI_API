import HttpException from "./HttpException";
 
export class NoDeleteException extends HttpException {
  constructor(codigo: string) {
    super(403, 'No se pudo eliminar elemento', codigo);
  }
}
 
export default NoDeleteException;