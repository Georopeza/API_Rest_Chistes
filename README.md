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
    - *GET /jokes :Se obtienen todos los chistes almacenados en la base de datos
    - *GET /joke?type=Chuck: Se obtiene un chiste de Chuck Norris por la api.
    - *GET /joke?type=Dad: Se obtiene un "Dad Joke" de la api.
    - *GET /joke?type=Propio: Obtiene un chiste propio desde la base de datos.
    - *POST /joke: Crear un nuevo chiste (requiere texto, puntaje y categoría).
        Se usa el postman para los datos, se coloca el post, la direccion con /joke y
        tiene la siguiente forma {
                                "text": "¿Por qué el libro de matemáticas está triste? ",
                                "author": "Juan",
                                "rating": 8,
                                "category": "Chistoso"
                                }
    donde   "text" es el chiste 
            "author" es el autor
            "rating" la valoracion
            "category" la categoria 
    se puede copiar y pegar ese mismo formato y sustituir los campos para ingresar datos con el postman.

    - *PUT /joke/:id: Actualizar un chiste por su ID.
    - *DELETE /joke/:id: Eliminar un chiste por su ID.
    - *GET /joke/:id: Obtener un chiste por su ID.
    - *GET /jokes/count/category/:category: Obtener la cantidad de chistes por categoría.
    - *GET /jokes/score/:rating: Obtener todos los chistes con un puntaje específico.
