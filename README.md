# API de Chistes (Chuck, Dad, y Chistes Propios)
Requisitos:
    Node.js
    MongoDB 
    Docker 


Para correr el proyecto:
    git clone https://github.com/usuario/API_Rest_chistes.git
    npm install
    
Luego para correr con docker:
    docker run --name mongodb -d -p 27017:27017 mongo

Para usarlo:

    npm start
    El servidor estará corriendo en el puerto 3000

Para el uso
    - *GET /joke?type=Chuck: Se obtiene un chiste de Chuck Norris por la api.
    - *GET /joke?type=Dad: Se obtiene un "Dad Joke" de la api.
    - *GET /joke?type=Propio: Obtiene un chiste propio desde la base de datos.
    - *POST /joke: Crear un nuevo chiste (requiere texto, puntaje y categoría).
    - *PUT /joke/:id: Actualizar un chiste por su ID.
    - *DELETE /joke/:id: Eliminar un chiste por su ID.
    - *GET /joke/:id: Obtener un chiste por su ID.
    - *GET /jokes/count/category/:category: Obtener la cantidad de chistes por categoría.
    - *GET /jokes/score/:rating: Obtener todos los chistes con un puntaje específico.

Para correr las pruebas se usaron herramientas como **Mocha* y *Chai*.

Para correr las pruebas:

npm test