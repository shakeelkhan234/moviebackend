const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const multer=require("multer");
const Movie = require("./movieModel");
const fs = require("fs");
const cors = require('cors');


const app=express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

mongoose.connect("mongodb://localhost:27017/movies") .then(() => {
  console.log("MongoDB connected");
})
.catch((error) => {
  console.error("MongoDB connection error:", error);
});

app.post("/",(req,res)=>{
   console.log(req.body);
})

app.post("/movies", upload.single("image"),   async (req,res)=>{
    
        const { title,year,genre,rating } =req.body;
        const image = req.file.buffer;
   
    const newMovie = new Movie({
        title,
        year,
        genre,
        rating,
        image : image,
    });
    await newMovie.save();
   
    res.send("Movie added successfully");
})


// route for getting all movies
app.get("/getmovies", async (req, res) => {
  try {
    const movies = await Movie.find();
    const moviesWithBase64Images = movies.map(movie => {
      const base64Image = movie.image.toString('base64');
      return {
        ...movie._doc,
        image: `data:image/jpg;base64,${base64Image}`
      };
    });
    res.json(moviesWithBase64Images); // Send the movies data with base64 images as a JSON response
  } catch (err) {
    res.status(500).send("Error fetching movies: " + err.message);
  }
 
});

    
app.listen(5000,()=>{
    console.log("Server is running on port 5000");
    console.log("mongodb is connected");
})