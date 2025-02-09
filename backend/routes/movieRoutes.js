    const express = require("express");
    const router = express.Router();
    const cors = require('cors')

    const {
        getGenres, 
        addGenre, 
        getMoviesByGenre, 
        addMovie, 
        deleteMovie,
        deleteGenre
    } = require("../controllers/movieControllers");

    router.use(
        cors({
            credentials: true,
            origin: 'http://localhost:5173'
        })
    )

    // Routes related to genres
    router.get("/genres/:userId", getGenres); // Fetch all genres
    router.post("/genre", addGenre); // Add a new genre

    // Routes related to movies
    router.get("/movies/:userId/:genreId", getMoviesByGenre); // Fetch movies by genre
    router.post("/movie", addMovie); // Add a new movie
    router.delete("/movie/:userId/:movieId", deleteMovie);
    router.delete("/genre/:userId/:genreId", deleteGenre);

    // Export the router
module.exports = router;
