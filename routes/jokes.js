const axios =require('axios');
const JokeModel = require ('../models/joke');
module.exports = async (app) => {
/**
 * @swagger
 * /joke:
 *   get:
 *     summary: Obtener un chiste según el tipo (Chuck, Dad, Propio)
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         description: El tipo de chiste (Chuck, Dad o Propio)
 *         schema:
 *           type: string
 *           enum:
 *             - Chuck
 *             - Dad
 *             - Propio
 *     responses:
 *       200:
 *         description: Chiste obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 joke:
 *                   type: string
 *       400:
 *         description: Parámetro inválido
 *       500:
 *         description: Error al obtener chiste
 */

    //Get para obtener los chistes dependiendo del parametro
    app.get('/joke', async (req, res) => {
    const { type } = req.query;  // El parámetro "type" (Chuck, Dad o Propio)
    //Si es chuck
    if (type === 'Chuck') {
        try {
            const response = await axios.get('https://api.chucknorris.io/jokes/random');
            return res.json({ joke: response.data.value });
        } catch (error) {
            return res.status(500).json({ message: 'Error al obtener chiste de Chuck Norris API' });
        }
    }
    //Si es Dad
    if (type === 'Dad') {
        try {
            const response = await axios.get('https://icanhazdadjoke.com/', {
                headers: { 'Accept': 'application/json' }
            });
            return res.json({ joke: response.data.joke });
        } catch (error) {
            return res.status(500).json({ message: 'Error al obtener chiste de Dad Jokes API' });
        }
    }
    //Si es propio
    if (type === 'Propio') {
        try {
            const joke = await JokeModel.findOne().sort({ _id: -1 });  // Obtiene el chiste más reciente
            if (joke) {
                return res.json({ joke: joke.text });
            } else {
                return res.status(404).json({ message: 'Aun no hay chistes, cree uno' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Error al obtener chistes de la base de datos' });
        }
    }

    return res.status(400).json({ message: 'Parámetro inválido. Usa "Chuck", "Dad" o "Propio"' });
    });

/**
 * @swagger
 * /joke:
 *   post:
 *     summary: Crear un nuevo chiste
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               author:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 example: 8
 *               category:
 *                 type: string
 *                 enum:
 *                   - Dad joke
 *                   - Humor Negro
 *                   - Chistoso
 *                   - Malo
 *     responses:
 *       201:
 *         description: Chiste creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Chiste creado'
 *                 id:
 *                   type: string
 *       400:
 *         description: Parámetros inválidos o faltantes
 *       500:
 *         description: Error al guardar el chiste
 */
    //Post para crear un nuevo chiste
    app.post('/joke', async (req, res) => {
        const { text, author = 'Se perdió en el Ávila como Led', rating, category } = req.body;

        if (!text || !rating || !category) {
            return res.status(400).json({ message: 'Texto, puntaje y categoría son requeridos' });
        }

        const validCategories = ['Dad joke', 'Humor Negro', 'Chistoso', 'Malo'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ message: 'Categoría inválida. Las categorías válidas son: Dad joke, Humor Negro, Chistoso, Malo' });
        }

        try {
            const newJoke = new JokeModel({ text, author, rating, category });
            await newJoke.save();
            return res.status(201).json({ message: 'Chiste creado', id: newJoke._id });
        } catch (error) {
            return res.status(500).json({ message: 'Error al guardar el chiste' });
        }
    });

/**
 * @swagger
 * /joke/{id}:
 *   put:
 *     summary: Actualizar un chiste por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del chiste a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               author:
 *                 type: string
 *               rating:
 *                 type: integer
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chiste actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 joke:
 *                   type: object
 *       404:
 *         description: Chiste no encontrado
 *       500:
 *         description: Error al actualizar el chiste
 */
    //PUT para actualizar chiste por su ID
            app.put('/joke/:id', async (req, res) => {
                const { id } = req.params;
                const { text, author, rating, category } = req.body;
        
                try {
                    const joke = await JokeModel.findById(id);
                    if (!joke) {
                        return res.status(404).json({ message: 'Chiste no encontrado' });
                    }
        
                    // Actualizando los campos proporcionados
                    if (text) joke.text = text;
                    if (author) joke.author = author;
                    if (rating) joke.rating = rating;
                    if (category) joke.category = category;
        
                    await joke.save();
                    return res.json({ message: 'Chiste actualizado', joke });
                } catch (error) {
                    return res.status(500).json({ message: 'Error al actualizar el chiste' });
                }
            });

/**
 * @swagger
 * /joke/{id}:
 *   delete:
 *     summary: Eliminar un chiste por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del chiste a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chiste eliminado exitosamente
 *       404:
 *         description: Chiste no encontrado
 *       500:
 *         description: Error al eliminar el chiste
 */
    //DELETE: Eliminar un chiste por su ID
    app.delete('/joke/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const joke = await JokeModel.findByIdAndDelete(id);
            if (!joke) {
                return res.status(404).json({ message: 'Chiste no encontrado' });
            }
            return res.json({ message: 'Chiste eliminado' });
        } catch (error) {
            return res.status(500).json({ message: 'Error al eliminar el chiste' });
        }
    });

/**
 * @swagger
 * /joke/{id}:
 *   get:
 *     summary: Obtener un chiste por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del chiste a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chiste obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 joke:
 *                   type: string
 *       404:
 *         description: Chiste no encontrado
 *       500:
 *         description: Error al obtener el chiste
 */
    //GET: Obtener un chiste por su ID
    app.get('/joke/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const joke = await JokeModel.findById(id);
            if (!joke) {
                return res.status(404).json({ message: 'Chiste no encontrado' });
            }
            return res.json({ joke });
        } catch (error) {
            return res.status(500).json({ message: 'Error al obtener el chiste' });
        }
    });

    /**
 * @swagger
 * /jokes/count/category/{category}:
 *   get:
 *     summary: Obtener la cantidad de chistes por categoría
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         description: La categoría de los chistes (Dad joke, Humor Negro, Chistoso, Malo)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cantidad de chistes por categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *       400:
 *         description: Categoría inválida
 *       404:
 *         description: No hay chistes en la categoría especificada
 *       500:
 *         description: Error al contar los chistes
 */
    // GET: Obtener la cantidad de chistes por categoría
    app.get('/jokes/count/category/:category', async (req, res) => {
        const { category } = req.params;

        const validCategories = ['Dad joke', 'Humor Negro', 'Chistoso', 'Malo'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ message: 'Categoría inválida' });
        }

        try {
            const count = await JokeModel.countDocuments({ category });
            if (count === 0) {
                return res.status(404).json({ message: `No hay chistes en la categoría "${category}"` });
            }
            return res.json({ count });
        } catch (error) {
            return res.status(500).json({ message: 'Error al contar los chistes por categoría' });
        }
    });

/**
 * @swagger
 * /jokes/score/{rating}:
 *   get:
 *     summary: Obtener todos los chistes por puntaje
 *     parameters:
 *       - in: path
 *         name: rating
 *         required: true
 *         description: El puntaje de los chistes (1-10)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chistes obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   joke:
 *                     type: string
 *       400:
 *         description: Puntaje inválido (debe estar entre 1 y 10)
 *       404:
 *         description: No hay chistes con ese puntaje
 *       500:
 *         description: Error al obtener los chistes
 */
    // GET: Obtener todos los chistes por puntaje
    app.get('/jokes/score/:rating', async (req, res) => {
        const { rating } = req.params;

        if (isNaN(rating) || rating < 1 || rating > 10) {
            return res.status(400).json({ message: 'Puntaje inválido. Debe estar entre 1 y 10' });
        }

        try {
            const jokes = await JokeModel.find({ rating });
            if (jokes.length === 0) {
                return res.status(404).json({ message: `No hay chistes con puntaje ${rating}` });
            }
            return res.json({ jokes });
        } catch (error) {
            return res.status(500).json({ message: 'Error al obtener chistes por puntaje' });
        }
    });

/**
 * @swagger
 * /jokes:
 *   get:
 *     summary: Obtener todos los chistes
 *     responses:
 *       200:
 *         description: Chistes obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   joke:
 *                     type: string
 *       404:
 *         description: No hay chistes en la base de datos
 *       500:
 *         description: Error al obtener los chistes
 */
    // GET: Obtener todos los chistes
    app.get('/jokes', async (req, res) => {
        try {
            const jokes = await JokeModel.find();
            if (jokes.length === 0) {
                return res.status(404).json({ message: 'Aún no hay chistes en la base de datos' });
            }
            return res.json({ jokes });
        } catch (error) {
            return res.status(500).json({ message: 'Error al obtener todos los chistes' });
        }
    });
};
