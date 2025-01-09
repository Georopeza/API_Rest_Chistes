const mongoose = require('mongoose');

const jokeSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: String, default: "Se perdió en el Ávila como Led" },
    rating: { type: Number, required: true },
    category: { type: String, required: true, enum: ['Dad joke', 'Humor Negro', 'Chistoso', 'Malo'] }
});

const JokeModel = mongoose.model('Joke', jokeSchema);

module.exports = JokeModel;
