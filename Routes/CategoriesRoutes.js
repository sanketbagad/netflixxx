import express from "express";
import { getCategories, updateCategory, deleteCategory, createCategory } from "../Controllers/CategoriesController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);
router.post("/", protect, admin, createCategory);


export default router;