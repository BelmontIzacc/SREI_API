import { IsString, IsNotEmpty, IsDefined, IsNumber, IsBoolean, IsArray, IsOptional, IsObject } from 'class-validator';

export class CrearEquipo {
    @IsDefined({
        message: "El nombre del Equipo no puede ser nulo."
    })
    @IsString({
        message: "El nombre del Equipo debe de ser de tipo string."
    })
    @IsNotEmpty({
        message: "El nombre del Equipo no puede ser una cadena vacía."
    })
    public nombre!: string;

    @IsDefined({
        message: "El tipo del Equipo no puede ser nulo."
    })
    @IsString({
        message: "El tipo del Equipo debe de ser de tipo string."
    })
    @IsNotEmpty({
        message: "El tipo del Equipo no puede ser una cadena vacía."
    })
    public tipo!: string;

    @IsDefined({
        message: "El estado del Equipo no puede ser nulo."
    })
    @IsNumber()
    @IsNotEmpty({
        message: "El estado del Equipo no puede estar vacio."
    })
    public estado!: number;

    @IsDefined({
        message: "El campo disponible del Equipo no puede ser nulo."
    })
    @IsBoolean()
    @IsNotEmpty({
        message: "El campo disponible del Equipo no puede estar vacio."
    })
    public disponible!: boolean;

    @IsDefined({
        message: "El propietario del Equipo no puede ser nulo."
    })
    @IsString({
        message: "El propietario del Equipo debe de ser de tipo string."
    })
    @IsNotEmpty({
        message: "El propietario del Equipo no puede ser una cadena vacía."
    })
    public propietario!: string;

    @IsDefined({
        message: "Las caracteristicas del Equipo no puede ser nulo."
    })
    @IsObject({
        message: "Las caracteristicas del Equipo debe de ser un arreglo asociativo."
    })
    @IsNotEmpty({
        message: "Las caracteristicas del Equipo no puede estar vacio."
    })
    public caracteristicas!: Array<any>;

    @IsOptional()
    @IsDefined({
        message: "El checklist del Equipo no puede ser nulo."
    })
    @IsArray({
        message: "El checklist del Equipo debe de ser del tipo array."
    })
    @IsNotEmpty({
        message: "El checklist del Equipo no puede estar vacio."
    })
    public checklist!: Array<any>;
}

export class EditarEquipo {
    @IsDefined({
        message: "El id del Equipo no puede ser nulo."
    })
    @IsString({
        message: "El id del Equipo debe de ser de tipo string."
    })
    @IsNotEmpty({
        message: "El id del Equipo no puede ser una cadena vacía."
    })
    public id!: string;

    @IsOptional()
    @IsDefined({
        message: "El nombre del Equipo no puede ser nulo."
    })
    @IsString({
        message: "El nombre del Equipo debe de ser de tipo string."
    })
    @IsNotEmpty({
        message: "El nombre del Equipo no puede ser una cadena vacía."
    })
    public nombre!: string;

    @IsOptional()
    @IsDefined({
        message: "El tipo del Equipo no puede ser nulo."
    })
    @IsString({
        message: "El tipo del Equipo debe de ser de tipo string."
    })
    @IsNotEmpty({
        message: "El tipo del Equipo no puede ser una cadena vacía."
    })
    public tipo!: string;

    @IsOptional()
    @IsDefined({
        message: "El estado del Equipo no puede ser nulo."
    })
    @IsNumber()
    @IsNotEmpty({
        message: "El estado del Equipo no puede estar vacio."
    })
    public estado!: number;

    @IsOptional()
    @IsDefined({
        message: "El campo disponible del Equipo no puede ser nulo."
    })
    @IsBoolean()
    @IsNotEmpty({
        message: "El campo disponible del Equipo no puede estar vacio."
    })
    public disponible!: boolean;

    @IsOptional()
    @IsDefined({
        message: "El propietario del Equipo no puede ser nulo."
    })
    @IsString({
        message: "El propietario del Equipo debe de ser de tipo string."
    })
    @IsNotEmpty({
        message: "El propietario del Equipo no puede ser una cadena vacía."
    })
    public propietario!: string;

    @IsOptional()
    @IsDefined({
        message: "Las caracteristicas del Equipo no puede ser nulo."
    })
    @IsObject({
        message: "Las caracteristicas del Equipo debe de ser un arreglo asociativo."
    })
    @IsNotEmpty({
        message: "Las caracteristicas del Equipo no puede estar vacio."
    })
    public caracteristicas!: Array<any>;

    @IsOptional()
    @IsDefined({
        message: "El checklist del Equipo no puede ser nulo."
    })
    @IsArray({
        message: "El checklist del Equipo debe de ser del tipo array."
    })
    @IsNotEmpty({
        message: "El checklist del Equipo no puede estar vacio."
    })
    public checklist!: Array<any>;
}