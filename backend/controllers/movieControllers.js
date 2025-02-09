const User = require('../models/user');
const Movie = require("../models/movies");
const Genre = require("../models/genres");
const mongoose = require("mongoose");

const getGenres = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID format" });
    }

    try {
        // Retrieve genres specific to the user
        const genres = await Genre.find({ userId });
        
        // Respond with the genres data
        res.json(genres);
    } catch (error) {
        console.error("Error fetching genres:", error);
        res.status(500).json({ error: "Failed to load genres" });
    }
};

const addGenre = async (req, res) => {
    const { genre, userId } = req.body;
    
    if (!genre || genre.trim() === "") {
        return res.status(400).json({ error: "Genre name is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID format" });
    }
    
    try {

        // Check if genre already exists for this user
        const existingGenre = await Genre.findOne({ name: genre, userId });
        if (existingGenre) {
            console.log('Existing genre found:', existingGenre); // Debug log
            return res.status(400).json({ error: "Genre already exists for this user" });
        }

        // Create a new genre document with userId
        const newGenre = new Genre({ 
            name: genre,
            userId
        });
        
        await newGenre.save();
        res.json({ message: "Genre added successfully!" });
    } catch (error) {
        console.error("Error adding genre:", error);
        res.status(500).json({ error: "Failed to add genre" });
    }
};


const getMoviesByGenre = async (req, res) => {
    const { userId, genreId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(genreId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
        // Check if the genre exists and belongs to the user
        const genreExists = await Genre.findOne({ _id: genreId, userId });
        if (!genreExists) {
            return res.status(404).json({ error: "Genre not found for this user" });
        }

        // Fetch movies by genre and user
        const movies = await Movie.find({ genre: genreId, userId });
        return res.json(movies);
    } catch (error) {
        console.error("Error fetching movies by genre:", error);
        return res.status(500).json({ error: "Failed to fetch movies. Please try again." });
    }
};

const addMovie = async (req, res) => {
    const { movie, genreId, userId } = req.body;

    if (!movie || movie.trim() === "") {
        return res.status(400).json({ error: "Movie title is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(genreId)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
        // Check if the genre exists and belongs to the user
        const genre = await Genre.findOne({ _id: genreId, userId });

        if (!genre) {
            return res.status(404).json({ error: "Genre not found for this user" });
        }

        // Create a new movie document with userId
        const newMovie = new Movie({ 
            title: movie, 
            genre: genreId,
            userId 
        });

        await newMovie.save();
        res.json({ message: "Movie added successfully!" });
    } catch (error) {
        console.error("Error adding movie:", error);
        res.status(500).json({ error: "Failed to add movie" });
    }
};

const deleteMovie = async (req, res) => {
    const { userId, movieId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(movieId)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
        // Find and delete the movie only if it belongs to the user
        const movie = await Movie.findOneAndDelete({ _id: movieId, userId });
        
        if (!movie) {
            return res.status(404).json({ error: "Movie not found for this user" });
        }
        
        res.json({ message: "Movie deleted successfully!" });
    } catch (error) {
        console.error("Error deleting movie:", error);
        res.status(500).json({ error: "Failed to delete movie" });
    }
};

const deleteGenre = async (req, res) => {
    const { userId, genreId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(genreId)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
        // First, delete all movies associated with this genre and user
        await Movie.deleteMany({ genre: genreId, userId });
        
        // Then delete the genre if it belongs to the user
        const genre = await Genre.findOneAndDelete({ _id: genreId, userId });
        
        if (!genre) {
            return res.status(404).json({ error: "Genre not found for this user" });
        }
        
        res.json({ message: "Genre and associated movies deleted successfully!" });
    } catch (error) {
        console.error("Error deleting genre:", error);
        res.status(500).json({ error: "Failed to delete genre" });
    }
};

module.exports = {
    getGenres,
    addGenre,
    getMoviesByGenre,
    addMovie,
    deleteMovie,
    deleteGenre
};