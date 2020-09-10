import { codigos } from './codigos';
/**
 * https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 */
class HttpException extends Error {
    estatus: number;
    mensaje: string;
    codigo: string;
    extra: any;

    constructor(estatus: number, mensaje: string, codigo: string = codigos.indefinido, extra?: Error|any) {
      super(mensaje);
      this.estatus = estatus;
      this.mensaje = mensaje;
      this.codigo = codigo;
      if(extra !== undefined && extra !== null){
        this.extra ={
          name: extra.name,
          message: extra.message
        }
      }
    }
  }
   
  export default HttpException;