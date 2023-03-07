import express from "express";
import { deleteAllMovies, topRatedMovies, getRandomMovies, createMovieReview, importMovies } from "../Controllers/MoviesController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.delete("/deleteAllMovies", deleteAllMovies);
router.post("/reviews", protect, createMovieReview);
router.get("/topRatedMovies", topRatedMovies);
router.get("/randomMovies", getRandomMovies);
router.post("/importMovies", importMovies);


export default router;

