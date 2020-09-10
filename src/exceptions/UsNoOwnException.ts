import HttpException from "./HttpException";
 
class UsNoOwnException extends HttpException {
  constructor(codigo?: string) {
    super(401, 'No tiene propiedad sobre la información que se intenta acceder', codigo);
  }
}
 
export default UsNoOwnException;