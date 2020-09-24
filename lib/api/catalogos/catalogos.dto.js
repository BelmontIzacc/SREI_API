"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditarEquipo = exports.CrearEquipo = void 0;
const class_validator_1 = require("class-validator");
class CrearEquipo {
}
__decorate([
    class_validator_1.IsDefined({
        message: "El nombre del Equipo no puede ser nulo."
    }),
    class_validator_1.IsString({
        message: "El nombre del Equipo debe de ser de tipo string."
    }),
    class_validator_1.IsNotEmpty({
        message: "El nombre del Equipo no puede ser una cadena vacía."
    })
], CrearEquipo.prototype, "nombre", void 0);
__decorate([
    class_validator_1.IsDefined({
        message: "El tipo del Equipo no puede ser nulo."
    }),
    class_validator_1.IsString({
        message: "El tipo del Equipo debe de ser de tipo string."
    }),
    class_validator_1.IsNotEmpty({
        message: "El tipo del Equipo no puede ser una cadena vacía."
    })
], CrearEquipo.prototype, "tipo", void 0);
__decorate([
    class_validator_1.IsDefined({
        message: "El estado del Equipo no puede ser nulo."
    }),
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty({
        message: "El estado del Equipo no puede estar vacio."
    })
], CrearEquipo.prototype, "estado", void 0);
__decorate([
    class_validator_1.IsDefined({
        message: "El campo disponible del Equipo no puede ser nulo."
    }),
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty({
        message: "El campo disponible del Equipo no puede estar vacio."
    })
], CrearEquipo.prototype, "disponible", void 0);
__decorate([
    class_validator_1.IsDefined({
        message: "El propietario del Equipo no puede ser nulo."
    }),
    class_validator_1.IsString({
        message: "El propietario del Equipo debe de ser de tipo string."
    }),
    class_validator_1.IsNotEmpty({
        message: "El propietario del Equipo no puede ser una cadena vacía."
    })
], CrearEquipo.prototype, "propietario", void 0);
__decorate([
    class_validator_1.IsDefined({
        message: "Las caracteristicas del Equipo no puede ser nulo."
    }),
    class_validator_1.IsObject({
        message: "Las caracteristicas del Equipo debe de ser un arreglo asociativo."
    }),
    class_validator_1.IsNotEmpty({
        message: "Las caracteristicas del Equipo no puede estar vacio."
    })
], CrearEquipo.prototype, "caracteristicas", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsDefined({
        message: "El checklist del Equipo no puede ser nulo."
    }),
    class_validator_1.IsArray({
        message: "El checklist del Equipo debe de ser del tipo array."
    }),
    class_validator_1.IsNotEmpty({
        message: "El checklist del Equipo no puede estar vacio."
    })
], CrearEquipo.prototype, "checklist", void 0);
exports.CrearEquipo = CrearEquipo;
class EditarEquipo {
}
__decorate([
    class_validator_1.IsDefined({
        message: "El id del Equipo no puede ser nulo."
    }),
    class_validator_1.IsString({
        message: "El id del Equipo debe de ser de tipo string."
    }),
    class_validator_1.IsNotEmpty({
        message: "El id del Equipo no puede ser una cadena vacía."
    })
], EditarEquipo.prototype, "id", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsDefined({
        message: "El nombre del Equipo no puede ser nulo."
    }),
    class_validator_1.IsString({
        message: "El nombre del Equipo debe de ser de tipo string."
    }),
    class_validator_1.IsNotEmpty({
        message: "El nombre del Equipo no puede ser una cadena vacía."
    })
], EditarEquipo.prototype, "nombre", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsDefined({
        message: "El tipo del Equipo no puede ser nulo."
    }),
    class_validator_1.IsString({
        message: "El tipo del Equipo debe de ser de tipo string."
    }),
    class_validator_1.IsNotEmpty({
        message: "El tipo del Equipo no puede ser una cadena vacía."
    })
], EditarEquipo.prototype, "tipo", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsDefined({
        message: "El estado del Equipo no puede ser nulo."
    }),
    class_validator_1.IsNumber(),
    class_validator_1.IsNotEmpty({
        message: "El estado del Equipo no puede estar vacio."
    })
], EditarEquipo.prototype, "estado", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsDefined({
        message: "El campo disponible del Equipo no puede ser nulo."
    }),
    class_validator_1.IsBoolean(),
    class_validator_1.IsNotEmpty({
        message: "El campo disponible del Equipo no puede estar vacio."
    })
], EditarEquipo.prototype, "disponible", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsDefined({
        message: "El propietario del Equipo no puede ser nulo."
    }),
    class_validator_1.IsString({
        message: "El propietario del Equipo debe de ser de tipo string."
    }),
    class_validator_1.IsNotEmpty({
        message: "El propietario del Equipo no puede ser una cadena vacía."
    })
], EditarEquipo.prototype, "propietario", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsDefined({
        message: "Las caracteristicas del Equipo no puede ser nulo."
    }),
    class_validator_1.IsObject({
        message: "Las caracteristicas del Equipo debe de ser un arreglo asociativo."
    }),
    class_validator_1.IsNotEmpty({
        message: "Las caracteristicas del Equipo no puede estar vacio."
    })
], EditarEquipo.prototype, "caracteristicas", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsDefined({
        message: "El checklist del Equipo no puede ser nulo."
    }),
    class_validator_1.IsArray({
        message: "El checklist del Equipo debe de ser del tipo array."
    }),
    class_validator_1.IsNotEmpty({
        message: "El checklist del Equipo no puede estar vacio."
    })
], EditarEquipo.prototype, "checklist", void 0);
exports.EditarEquipo = EditarEquipo;
//# sourceMappingURL=catalogos.dto.js.map