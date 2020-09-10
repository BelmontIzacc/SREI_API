import HttpException from "./HttpException";
import { codigos } from './codigos';
 
class InternalServerException extends HttpException {
  constructor(mesage: any, object?: Error|any) {
    super(500, mesage, codigos.indefinido, object);
  }
}
 
export default InternalServerException;