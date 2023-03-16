import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    userImage: {
        type: String
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }, 
},
{
    timestamps: true,
});

const seriesSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    titleImage: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    time: {
        type: Number,
        required: true,
    },
    videos: [
        {
            video: {
                type: String,
                required: true,
            },
            episode: {
                type: Number,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
        },
    ],
    trailer: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
        default: 0,
    },
    numberOfReviews: {
        type: Number,
        default: 0,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    reviews: [],
    casts: [
        {
            name: {
                type: String,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
        },
    ],
}
,
{
    timestamps: true,
});
   

const movieSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    titleImage: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    time: {
        type: Number,
        required: true,
    },
    video: {
        type: String,
    },
    trailer: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
        default: 0,
    },
    numberOfReviews: {
        type: Number,
        default: 0,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    genres: [
        {
            type: String,
        },
    ],
    reviews: [],
    casts: [
        {
            name: {
                type: String,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
        },
    ],
}
,
{
    timestamps: true,
});

export const MovieModel = mongoose.model("Movie", movieSchema);
export const ReviewModel = mongoose.model("Review", reviewSchema);
export const SeriesModel = mongoose.model("Series", seriesSchema);

