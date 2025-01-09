const axios =require('axios');
const JokerModel = require ('../models/joke');

MediaSourceHandle.exports = (app) => {
    //Get para obtener los chistes dependiendo del parametro
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
};

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