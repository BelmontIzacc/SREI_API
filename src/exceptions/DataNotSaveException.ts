import HttpException from "./HttpException";
 
export class DataNotSaveException extends HttpException {
  constructor(codigo: string) {
    super(400, 'Error al guardar los datos', codigo);
  }
}
 
export default DataNotSaveException;