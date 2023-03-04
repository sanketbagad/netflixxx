import express from "express";
import { importMovies, deleteAllMovies, getMovies, getMovieById, topRatedMovies, getRandomMovies, createMovieReview, updateMovie, deleteMovie, createMovie } from "../Controllers/MoviesController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/importMovies", importMovies);
router.delete("/deleteAllMovies", deleteAllMovies);
router.get("/", getMovies);
router.get("/movies/:id", getMovieById);
router.get("/m/topRatedMovies", topRatedMovies);
router.get("/m/randomMovies", getRandomMovies);
router.post("/:id/reviews", protect, createMovieReview);

router.put("/movies/:id", protect, admin, updateMovie);
router.delete("/movies/:id", protect, admin, deleteMovie);
router.post("/", protect, admin, createMovie);

export default router;

