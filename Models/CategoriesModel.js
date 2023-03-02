import mongoose from "mongoose";

const categoriesSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    }
},
{
    timestamps: true,
});

const CategoriesModel = mongoose.model("Categories", categoriesSchema);

export default CategoriesModel;

