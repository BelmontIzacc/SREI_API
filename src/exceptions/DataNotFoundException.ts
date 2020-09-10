import HttpException from "./HttpException";
 
class DataNotFoundException extends HttpException {
  constructor(codigo: string) {
    super(404, 'El documento no fue encontrado', codigo);
  }
}
 
export default DataNotFoundException;