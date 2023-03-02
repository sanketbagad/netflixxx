import CategoriesModel from "../Models/CategoriesModel.js";
import asynchandler from "express-async-handler";

const getCategories = asynchandler(async (req, res) => {
    const categories = await CategoriesModel.find({});
    res.json(categories);
    }
);

const createCategory = asynchandler(async (req, res) => {
    try {
       const { title } = req.body;

       const category = await CategoriesModel.create({
              title,
            });
            if (category) {
                res.status(201).json({
                    _id: category._id,
                    title: category.title,
                });
            }
            else {
                res.status(400);
                throw new Error('Invalid category data');
            }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const updateCategory = asynchandler(async (req, res) => {
    try {
        const category = await CategoriesModel.findById(req.params.id);
        if (category) {
            category.title = req.body.title || category.title;
            const updatedCategory = await category.save();
            res.json(updatedCategory);
        } else {
            res.status(404);
            throw new Error("Category not found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const deleteCategory = asynchandler(async (req, res) => {
    try {
        const category = await CategoriesModel.findById(req.params.id);
        if (category) {
            await category.remove();
            res.json({ message: "Category removed" });
        } else {
            res.status(404);
            throw new Error("Category not found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export { getCategories, createCategory, updateCategory, deleteCategory };

