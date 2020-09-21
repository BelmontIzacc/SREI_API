export default interface MS {
    id: string;
    nombre: string;
    laboratorio: string;
    usuarios: usuarios[];
    creacion: any;
    actualizado: any;
}

class usuarios{
    USR!: string;
    fecha!: any;
}