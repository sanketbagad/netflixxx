import express from "express";
import { deleteAllMovies, topRatedMovies, getRandomMovies } from "../Controllers/MoviesController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.delete("/deleteAllMovies", deleteAllMovies);

router.get("/topRatedMovies", topRatedMovies);
router.get("/randomMovies", getRandomMovies);


export default router;

