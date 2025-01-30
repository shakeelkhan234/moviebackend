const mongoose = require('mongoose');

// Define the movie schema
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
 
  genre: {
    type: String,
    required: true
  }
 

});

// Create the Movie model from the schema
const Movie = mongoose.model('Movie', movieSchema);

// Export the Movie model
module.exports = Movie;
