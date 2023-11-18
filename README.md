# Bootcamp del Master en Full Stack Web Development
## Descripción de contenidos

* Main folder: "docker_project_ines. Dentro se encuentra:
    * init-mongodb: con los archivos necesarios para que se pueda importar la base de datos a mongo, incluyendo coleccion de muestra en formaton json.
    * docker-compose y dockerfile: con los contenidos necesarios para crear la dockerizacion de todo lo necesario para testear el proyecto. 
    * rest.http: con las URL de testeo para comprobar que la base de datos se conecta correctamente con la API.
    * server-ines.js: con todas las funciones necesarias para realizar el projecto.

## Dockerización de la Base de Datos MongoDB y de Node
 
Por favor, síganse los siguientes pasos para visualizar el projecto correctamente. 



Para levantar la imagen de mongodb con la colección de usuarios y correr la API en node todo en uno, se debe utilizar el siguiente comando:
```bash
cd docker_project_ines/
docker-compose up
o si puede haber containers ya funcionando que pudieran causar problemas, se puede poner
docker-compose up --build
```

Para visualizar la base de datos, se puede utilizar la aplicacion MongoDB Compass
con la siguiente URL: mongodb://localhost:27017

Para testear, se puede utilizar el navegador, o mejor, como visto en clase, la aplicación Postman.
Referencia de las diferentes URL: archivo "rest.http". Ahi se han listado multiples URL para testeaer el codigo encontrado en server-ines.js



## License
MIT License
Copyright (c) 2023
