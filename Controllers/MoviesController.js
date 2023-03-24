import { Movies } from "../Data/movieData.js";
import asyncHandler from "express-async-handler";
import { MovieModel } from "../Models/MoviesModel.js";

const importMovies = asyncHandler(async (req, res) => {
  try {
    const movies = await MovieModel.insertMany(Movies);
    res.send({ movies });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const deleteAllMovies = asyncHandler(async (req, res) => {
  try {
    await MovieModel.deleteMany({});
    res.send({ message: "All movies deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const getMovies = asyncHandler(async (req, res) => {
  try {
    // filter movies by category, time, language, rate, year and search
    const { category, time, language, rate, year, search } = req.query;
    const query = {
      ...(category && { category }),
      ...(time && { time }),
      ...(language && { language }),
      ...(rate && { rate: { $gte: rate } }),
      ...(year && { year: { $gte: year } }),
      ...(search && {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { desc: { $regex: search, $options: "i" } },
        ],
      }),
    };

    let page = Number(req.query.page) || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    if (req.user && req.user.hasPaid) {
      const movies = await MovieModel.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
      const count = await MovieModel.countDocuments(query);
      res.json({ movies, page, pages: Math.ceil(count / limit) });
    } 
    else if (req.user && req.user.isAdmin) {
        try {
            const movies = await MovieModel.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    else {
      // only show movies having isPaid = false
      const movies = await MovieModel.find({ ...query, isPaid: false })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
      const count = await MovieModel.countDocuments({
        ...query,
        isPaid: false,
      });
      res.json({ movies, page, pages: Math.ceil(count / limit) });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const getMovieById = asyncHandler(async (req, res) => {
  const movie = await MovieModel.findById(req.params.id);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404);
    throw new Error("Movie not found");
  }
});

const bollywoodGenre = asyncHandler(async (req, res) => {
  // genre is array of strings
  try {
    if (req.user && req.user.hasPaid) {
      const movies = await MovieModel.find({
        genres: { $in: ["Bollywood"] },
      }).limit(req.query.limit || 10);
      res.json(movies);
    } else {
      const movies = await MovieModel.find({
        genres: { $in: ["Bollywood"] },
        isPaid: false,
      }).limit(req.query.limit || 10);
      res.json(movies);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const continueWatching = asyncHandler(async (req, res) => {
  try{
    if(req.user){
      const movies = await MovieModel.find({
        _id: { $in: req.body.movieIds },
      }).limit(req.query.limit || 10);
      res.json(movies);
    }
  } 
  catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const hollywoodGenre = asyncHandler(async (req, res) => {
  // genre is array of strings
  try {
    if (req.user && req.user.hasPaid) {
      const movies = await MovieModel.find({
        genres: { $in: ["Hollywood"] },
      }).limit(req.query.limit || 10);
      res.json(movies);
    } else {
      const movies = await MovieModel.find({
        genres: { $in: ["Hollywood"] },
        isPaid: false,
      }).limit(req.query.limit || 10);
      res.json(movies);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const newReleaseMovies = asyncHandler(async (req, res) => {
  try {
    if (req.user && req.user.hasPaid) {
      const movies = await MovieModel.find({})
        .sort({ createdAt: -1 })
        .limit(req.query.limit || 10);
      console.log(movies);
      res.json(movies);
    } else {
      const movies = await MovieModel.find({ isPaid: false })
        .sort({ createdAt: -1 })
        .limit(req.query.limit || 10);
      console.log(movies);
      res.json(movies);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const topRatedMovies = asyncHandler(async (req, res) => {
  try {
    if (req.user && req.user.hasPaid) {
      const movies = await MovieModel.find({})
        .sort({ rate: -1 })
        .limit(req.query.limit || 10);
      console.log(movies);
      res.json(movies);
    } else {
      const movies = await MovieModel.find({ isPaid: false })
        .sort({ rate: -1 })
        .limit(req.query.limit || 10);
      console.log(movies);
      res.json(movies);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const getRandomMovies = asyncHandler(async (req, res) => {
  try {
    if (req.user && req.user.hasPaid) {
      const movies = await MovieModel.aggregate([{ $sample: { size: 10 } }]);
      console.log(movies);
      res.json(movies);
    } else {
      const movies = await MovieModel.aggregate([
        { $sample: { size: 10 } },
      ]).find({ isPaid: false });
      console.log(movies);
      res.json(movies);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const createMovieReview = asyncHandler(async (req, res) => {
  try {
    const { rate, comment } = req.body;
    const movie = await MovieModel.findById(req.params.id);
    if (movie) {
      const alreadyReviewed = movie.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Movie already reviewed");
      }
      const review = {
        userName: req.user.fullName,
        userImage: req.user.image,
        rating: rate,
        comment,
        user: req.user._id,
      };
      movie.reviews.push(review);
      movie.numberOfReviews = movie.reviews.length;
      movie.rate =
        movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
        movie.reviews.length;
      await movie.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const updateMovie = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      desc,
      category,
      time,
      language,
      rate,
      year,
      image,
      isPaid,
      titleImage,
      video,
    } = req.body;
    const movie = await MovieModel.findById(req.params.id);
    if (movie) {
      movie.name = name || movie.name;
      movie.desc = desc || movie.desc;
      movie.category = category || movie.category;
      movie.time = time || movie.time;
      movie.language = language || movie.language;
      movie.rate = rate || movie.rate;
      movie.year = year || movie.year;
      movie.image = image || movie.image;
      movie.isPaid = isPaid || movie.isPaid;
      movie.titleImage = titleImage || movie.titleImage;
      movie.video = video || movie.video;
      movie.casts = req.body.casts || movie.casts;
      const updatedMovie = await movie.save();
      res.json(updatedMovie);
    } else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const deleteMovie = asyncHandler(async (req, res) => {
  try {
    const movie = await MovieModel.findById(req.params.id);
    if (movie) {
      await movie.remove();
      res.json({ message: "Movie removed" });
    } else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const createMovie = asyncHandler(async (req, res) => {
  const {
    name,
    desc,
    category,
    time,
    language,
    rate,
    year,
    image,
    isPaid,
    titleImage,
    video,
    trailer,
  } = req.body;
  try {
    const movie = new MovieModel({
      name,
      desc,
      category,
      time,
      language,
      rate,
      year,
      image,
      isPaid,
      titleImage,
      video,
      trailer,
      casts: req.body.casts,
      user: req.user._id,
      genres: req.body.genres,
    });
    if (movie) {
      const createdMovie = await movie.save();
      res.status(201).json(createdMovie);
    } else {
      res.status(400);
      throw new Error("Invalid movie data");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const premiumMovies = asyncHandler(async (req, res) => {
  try {
    const movies = await MovieModel.find({ isPaid: true });
    res.json(movies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export {
  importMovies,
  deleteAllMovies,
  getMovies,
  getMovieById,
  topRatedMovies,
  getRandomMovies,
  createMovieReview,
  updateMovie,
  deleteMovie,
  createMovie,
  newReleaseMovies,
  bollywoodGenre,
  hollywoodGenre,
  premiumMovies,
  continueWatching
};
