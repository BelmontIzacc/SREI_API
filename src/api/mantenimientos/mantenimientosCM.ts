/*
 *   Versión 1.0
 *   Creado al 21/09/2020
 *   Creado por: GBautista
 *   Modificado al: 23/10/2020
 *   Editado por: GBautista
 *   Copyright SReI
 */

import * as admin from 'firebase-admin';
import { variable } from '../variables';
import { codigos } from '../../exceptions/codigos';

// import de exceptions
import InternalServerException from '../../exceptions/InternalServerException';
import DataNotFoundException from '../../exceptions/DataNotFoundException';

// import de interfaces
import MNT from '../../interfaces/colecciones/MNT.interface';

// client manager, contiene toda la logica del manejo de los datos
export default class MantenimientoCM {
    // variables de acceso a db
    private db = admin.firestore();
    private refMnt = this.db.collection(variable['mantenimientos']);

    // Endpoint para retornar un registro de la coleccion MNT.
    public obtenerMantenimiento = async (mantenimiento: string) => {
        if (mantenimiento === undefined || mantenimiento === null || mantenimiento === '') {
            return new DataNotFoundException(codigos.datoNoEncontrado);
        }
        const registro = await this.refMnt.doc(mantenimiento).get()
            .then(data => {
                if (data.exists) {
                    const document = data.data() as MNT;
                    let fechaInicio;
                    let fechaFinal;
                    let ret;
                    if (!(document.fecha === undefined || document.fecha === null)){
                        fechaInicio = document.fecha.toDate().toISOString();
                    }
                    if (!(document.finalizado === undefined || document.finalizado === null)){
                        fechaFinal = document.finalizado.toDate().toISOString();
                    }
                    if (fechaFinal === undefined){
                        ret = {
                            title: document.id,
                            start: fechaInicio
                        };
                    }else{
                        ret = {
                            title: document.id,
                            start: fechaInicio,
                            end: fechaFinal
                        };
                    }
                    const response = {
                        doc: document,
                        fullcalendar: ret
                    };
                    return response;
                }
                return new DataNotFoundException(codigos.datoNoEncontrado);
            })
            .catch(err => {
                return new InternalServerException(codigos.datoNoEncontrado, err);
            });
        return registro;
    }

    // Endpoint para retornar subcoleccion de la coleccion Mantenimiento por laboratorio.
    public obtenerLabMNT = async (lab: string) => {
        const elements: any[] | PromiseLike<any[]> = [];
        if (lab === undefined || lab === null || lab === '') {
            return new DataNotFoundException(codigos.identificadorInvalido);
        }
        const registro = await this.refMnt.where("laboratorio","==",lab).get()
            .then(data => {
                if (!data.empty){
                    for (let index = 0; index < data.size; index++) {
                        if (data.docs[index].exists){
                            const document = data.docs[index].data() as MNT;
                            let fechaInicio;
                            let fechaFinal;
                            let ret;
                            // Estructura similar para definir fechas 
                            if (!(document.fecha === undefined || document.fecha === null)){
                                fechaInicio = document.fecha.toDate().toISOString();
                            }
                            if (!(document.finalizado === undefined || document.finalizado === null)){
                                fechaFinal = document.finalizado.toDate().toISOString();
                            }
                            // Definiendo tipo de JSON para visualizar
                            if (fechaFinal === undefined){
                                ret = {
                                    title: document.id,
                                    start: fechaInicio
                                };
                            }else{
                                ret = {
                                    title: document.id,
                                    start: fechaInicio,
                                    end: fechaFinal
                                };
                            }
                            elements[index] = ret;
                        }else{
                            return new DataNotFoundException(codigos.datoNoEncontrado);
                        }
                    }
                    return elements;
                }
                return new DataNotFoundException(codigos.datoNoEncontrado);
            }).catch(err=>{
                return new InternalServerException(codigos.datoNoEncontrado, err);
            });
        return registro;
    }

}
