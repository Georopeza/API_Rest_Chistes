const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Jokes API',
            version: '1.0.0',
            description: 'API para obtener y guardar chistes'
        },
    },
    apis: ['./routes/*.js'], // Ruta a tus archivos de rutas
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};