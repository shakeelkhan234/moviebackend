const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const Movie = require("../movieModel");
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',  // Allow all origins, or specify your frontend URL
  methods: ['GET', 'POST'],  // Ensure POST is allowed
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

mongoose.connect("mongodb+srv://shakeelkhan187004:shakeel@123@cluster0.svnwk.mongodb.net/movies?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.post("/", (req, res) => {
  console.log(req.body);
});

app.get("/new", (req, res) => {
  res.send("hello world");
});

app.post("/movies",  async (req, res) => {
  const { title,  genre } = req.body;
 

  const newMovie = new Movie({
    title,
   
    genre,
   
  });
  await newMovie.save();

  res.send("Note  added successfully");
});

// route for getting all movies
app.get("/getmovies", async (req, res) => {
  try {
    const movies = await Movie.find();
    const moviesWithBase64Images = movies.map(movie => {
      const base64Image = movie.image.toString('base64');
      return {
        ...movie._doc,
        image: `data:image/jpg;base64,${base64Image}`,
      };
    });
    res.json(moviesWithBase64Images);
  } catch (err) {
    res.status(500).send("Error fetching movies: " + err.message);
  }
});

// Export your Express app as a serverless function
module.exports = app;

