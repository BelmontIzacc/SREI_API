export default interface EQP {
    id: string;
    tipo: string;
    nombre: string;
    estado: number;
    disponible: boolean;
    propietario: string;
    laboratorio: string;
    caracteristicas: caracteristica;
    checklist: check[] | null;
    creacion: any;
    actualizado: any;
}

class caracteristica {
    fabricante!: string;
    modelo!: string;
    noSerie!: string;
    descripcion!: string;
}

class check {
    nombre!: string;
    acronimo!: string;
    estatus!: boolean;
    creacion!: any;
    actualizado!: any;
}