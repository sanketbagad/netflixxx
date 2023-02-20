import expressAsyncHandler from "express-async-handler";
import {UserModel} from "../Models/UsersModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/authMiddleware.js";
import sendEmail from "../middleware/emailMiddleware.js";
const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password, image } = req.body;
  try {
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
    // Create a new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await UserModel.create({
      fullName: name,
      email,
      password: hashedPassword,
      image,
      hasPaid: false,
    });

    if (user) {
        sendEmail(user.email, `Welcome to Netflixxx, ${user.fullName}!`, `Thank you for registering with us. We hope you enjoy your stay!`, `<h1>Welcome to Netflixxx, ${user.fullName}!</h1><p>Thank you for registering with us. We hope you enjoy your stay!</p> <h2> Subscription Details </h2> <p> You have not yet subscribed to any of our plans. Please visit our website to subscribe to a plan. </p>`);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            isAdmin: user.isAdmin,
            hasPaid: user.hasPaid,
            token: generateToken(user._id),

        })

        }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const loginUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                isAdmin: user.isAdmin,
                hasPaid: user.hasPaid,
                token: generateToken(user._id),
            });
        }
        else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const updateUserProfile = expressAsyncHandler(async (req, res) => {
    const { name, email, image } = req.body;
    try {
        const user = await UserModel.findById(req.user._id);
        if (user) {
            user.name = name || user.name;
            user.email = email || user.email;
            user.image = image || user.image;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                image: updatedUser.image,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser._id),
            });
        }
        else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const deleteUser = expressAsyncHandler(async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id);
        if (user) {
            if (user.isAdmin) {
                res.status(400);
                throw new Error('Admin user cannot be deleted');
            }
            await user.remove();
            res.json({ message: 'User removed' });
        }
        else {
            res.status(404);
            throw new Error('User not found');
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const changePassword = expressAsyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await UserModel.findById(req.user._id);
        if (user) {
            if (await bcrypt.compare(oldPassword, user.password)) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);
                user.password = hashedPassword;
                await user.save();
                res.json({ message: 'Password changed' });
            }
            else {
                res.status(401);
                throw new Error('Invalid password');
            }
        }
        else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// get user liked movies
const getUserLikedMovies = expressAsyncHandler(async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id).populate('likedMovies');
        if (user) {
            res.json(user.likedMovies);
        }
        else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const addLikedMovie = expressAsyncHandler(async (req, res) => {
    const { movieId } = req.body;
    try {
        const user = await UserModel.findById(req.user._id);
        if (user) {
            if (user.likedMovies.includes(movieId)) {
                res.status(400);
                throw new Error('Movie already liked');
            }
            user.likedMovies.push(movieId);
            await user.save();
            res.json(user.likedMovies);
        }
        else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const removeAllLikedMovies = expressAsyncHandler(async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id);
        if (user) {
            user.likedMovies = [];
            await user.save();
            res.json(user.likedMovies);
        }
        else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Admin only
const getUsers = expressAsyncHandler(async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const deleteUserById = expressAsyncHandler(async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (user) {
           if (user.isAdmin) {
                res.status(400);
                throw new Error('Admin user cannot be deleted');
            }
            await user.remove();
            res.json({ message: 'User removed' });
        }
        else {
            res.status(404);
            throw new Error('User not found');
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const deleteAllUsers = expressAsyncHandler(async (req, res) => {
    try {
        await UserModel.deleteMany({});
        res.json({ message: 'All users removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// google login
const googleRegisterorLogin = expressAsyncHandler(async (req, res) => {
    const { email, name, image } = req.body;
    try {
        // first check if user already exists using email
        let user = await UserModel.findOne({ email });
        if (user) {
            // if user exists, generate token and send it back
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });

        }
        else {
            // if user does not exist, create a new user
            user = await UserModel.create({
                name,
                email,
                image,
                password: 'google',
            });
            if (user) {
                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    isAdmin: user.isAdmin,
                    token: generateToken(user._id),
                });
            }
            else {
                res.status(400);
                throw new Error('Invalid user data');
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

    





export { registerUser , loginUser , updateUserProfile , deleteUser , changePassword , getUserLikedMovies , addLikedMovie, removeAllLikedMovies , getUsers , deleteUserById , deleteAllUsers, googleRegisterorLogin };
