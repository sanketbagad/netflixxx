import express from "express";
import { deleteAllMovies, topRatedMovies, getRandomMovies, createMovieReview, importMovies, bollywoodGenre, hollywoodGenre, newReleaseMovies, premiumMovies } from "../Controllers/MoviesController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.delete("/deleteAllMovies", deleteAllMovies);
// router.post("/reviews/", protect, createMovieReview);
router.get("/topRatedMovies", topRatedMovies);
router.get("/randomMovies", getRandomMovies);
router.post("/importMovies", importMovies);
router.get("/bollywoodGenre", bollywoodGenre);
router.get("/hollywoodGenre", hollywoodGenre);
router.get("/newReleaseMovies", newReleaseMovies);
router.get("/premiumMovies", premiumMovies);


export default router;

