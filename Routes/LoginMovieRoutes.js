import express from "express";
import {  topRatedMovies, getRandomMovies, getMovies, bollywoodGenre, hollywoodGenre, newReleaseMovies, premiumMovies } from "../Controllers/MoviesController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

// for logged in users

router.get("/topRatedMovies", protect, topRatedMovies);
router.get("/randomMovies", protect, getRandomMovies);
router.get("/bollywoodGenre", protect, bollywoodGenre);
router.get("/hollywoodGenre", protect, hollywoodGenre);
router.get("/newReleaseMovies", protect, newReleaseMovies);
router.get("/premiumMovies", protect, premiumMovies);
router.get("/", protect, getMovies);

// for admin users
router.post("/topRatedMovies", protect, admin, topRatedMovies);
router.post("/randomMovies", protect, admin, getRandomMovies);
router.post("/bollywoodGenre", protect, admin, bollywoodGenre);
router.post("/hollywoodGenre", protect, admin, hollywoodGenre);
router.post("/newReleaseMovies", protect, admin, newReleaseMovies);
router.post("/premiumMovies", protect, admin, premiumMovies);
router.post("/admin", protect, admin, getMovies);

export default router;