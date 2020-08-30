# API SREI

El servidor para SREI dará soporte a las acciones o consultas realizadas desde SREI Web y SREI Móvil

## Comenzando 🚀

_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas._

Mira **Despliegue** para conocer como desplegar el proyecto.


### Pre-requisitos 📋

Que cosas necesitas para instalar el software y como instalarlas

* Tienen que tener funcionando y activo su mongodb.


### Instalación 🔧

* Al descargar el repositorio tienen que instalar las dependencias o módulos necesarios para su funcionamiento.

```
npm install
```

Al integrarlos en la terminal les quedara de la siguiente manera:

```
... /API_SREI/npm install  <- linea en terminal o cmd
```
Con el anterior comando ejecutado desde su terminal podrán instalar las dependencias o módulos necesarios.

### Estilo de codificación ⌨️

Recuerden apegarse a los estándares de codificación

## Despliegue 📦

Recuerden que para ejecutar el servidor tienen que ejecutar el siguiente comando en:
* API_SREI/ aquí iría el siguiente código en su terminal

```
npm run dev
```
* Quedando de la siguiente manera

```
... /API_SREI/npm run dev  <- linea en terminal o cmd
```

## Construido con 🛠️

* Nodejs
* Mongodb
* PostMan

## Contribuyendo 🖇️

* Dar una explicación de que se esta realizando en cada PULL.
* Ya se tiene creada la estructura para no chocar con los demás documentos, si se modifican archivos importantes como
  * index.js
  * package.json

* Avisar para no tener problemas.

## Comentarios de login
* El modulo de login debe recibir un json como se especifica
    {
        "username": "boleta",
        "password": "contraseña"
    }
* La contraseña debe estar limitada a 10 caracteres debido al funcionamiento del GESCO
* Con la finalidad de no saturar la api de la escuela se dejó una respuesta fija con la cual se podrán hacer las pruebas, en caso de necesitar más usuarios pídanlos y serán agregados
* Los datos de acceso del usuario de prueba son:
    {
        "username": "2222222222",
        "password": "1234"
    }

## Autores ✒️

* **IBelmont**
* **OBelmonte**
* **GBautista**
