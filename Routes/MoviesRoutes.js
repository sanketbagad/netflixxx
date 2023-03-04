import express from "express";
import { importMovies, deleteAllMovies, getMovies, getMovieById, topRatedMovies, getRandomMovies, createMovieReview, updateMovie, deleteMovie, createMovie } from "../Controllers/MoviesController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/importMovies", importMovies);
router.delete("/deleteAllMovies", deleteAllMovies);
router.get("/m", getMovies);
router.get("/m/:id", getMovieById);
router.get("/topRatedMovies", topRatedMovies);
router.get("/randomMovies", getRandomMovies);
router.post("/m/:id/reviews", protect, createMovieReview);

router.put("/m/:id", protect, admin, updateMovie);
router.delete("/m/:id", protect, admin, deleteMovie);
router.post("/m", protect, admin, createMovie);

export default router;

