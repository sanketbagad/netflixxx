import expressAsyncHandler from "express-async-handler";
import {UserModel, QueryModel} from "../Models/UsersModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/authMiddleware.js";
import sendEmail from "../middleware/emailMiddleware.js";
import { OtpModel } from "../Models/UsersModel.js";

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
        sendEmail(user.email, `Welcome to Plixx, ${user.fullName}!`, `Thank you for registering with us. We hope you enjoy your stay!`, `<h1>Welcome to Plixx, ${user.fullName}!</h1><p>Thank you for registering with us. We hope you enjoy your stay!</p> <h2> Subscription Details </h2> <p> You have not yet subscribed to any of our plans. Please visit our website to subscribe to a plan. </p>`);
        res.status(201).json({
            _id: user._id,
            name: user.fullName,
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
                name: user.fullName,
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
            user.fullName = name || user.fullName;
            user.email = email || user.email;
            user.image = image || user.image;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.fullName,
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
    try {
        let { movieId } = req.body;
        console.log(movieId);

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

const removeLikedMovie = expressAsyncHandler(async (req, res) => {
    const { movieId } = req.body;
    try {
        const user = await UserModel.findById(req.user._id);
        if (user) {
            if (!user.likedMovies.includes(movieId)) {
                res.status(400);
                throw new Error('Movie not liked');
            }
            user.likedMovies = user.likedMovies.filter((movie) => movie != movieId);
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
                name: user.fullName,
                email: user.email,
                image: user.image,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
                hasPaid: user.hasPaid,
            });

        }
        else {
            // if user does not exist, create a new user
            user = await UserModel.create({
                fullName: name,
                email: email,
                image: image,
                password: 'google',
            });
            if (user) {
                sendEmail(user.email, `Welcome to Plixx, ${user.fullName}!`, `Thank you for registering with us. We hope you enjoy your stay!`, `<h1>Welcome to Plixx, ${user.fullName}!</h1><p>Thank you for registering with us. We hope you enjoy your stay!</p> <h2> Subscription Details </h2> <p> You have not yet subscribed to any of our plans. Please visit our website to subscribe to a plan. </p>`);
                res.json({
                    _id: user._id,
                    name: user.fullName,
                    email: user.email,
                    image: user.image,
                    isAdmin: user.isAdmin,
                    token: generateToken(user._id),
                    hasPaid: user.hasPaid,
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

const sendOTP = expressAsyncHandler(async (req, res) => {
    const { email } = req.body;
    try {
        
        const user = await UserModel.findOne({ email });

        if (user) {
            // get userID from user then create a new OTP in OTP collection with userID, OTP, expiry time and isVerified fields
            const otp = Math.floor(100000 + Math.random() * 900000);
            const expiryTime = Date.now() + 300000;
            const newOTP = await OtpModel.create({
                userID: user._id,
                otp,
                expiryTime,
                isVerified: false,
            });
            if (newOTP) {
                // send email to user with OTP
                sendEmail(email, 'OTP', `Your OTP is ${otp}`);
                res.json({ message: 'OTP sent' });

                // delete all OTPs for that user that are not verified and have expired after 5 minutes
                await OtpModel.deleteMany({ userID: user._id, isVerified: false, expiryTime: { $lt: Date.now() } });
             
            }
            else {
                res.status(400);
                throw new Error('Invalid OTP data');
            }
        }

            
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
    })

    const verifyOTP = expressAsyncHandler(async (req, res) => {
        const { email, otp } = req.body;
        try {
            const user = await UserModel.findOne({ email });
            if (user) {
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    })

const createQueryRequest = (req, res) => {
    const { query, subject, image } = req.body;
    try {
        const newQuery = QueryModel.create({
            query,
            subject,
            image,
            userId: req.user._id,
        });
        if (newQuery) {
            let users = [];
            // now get email of user and send email to admin
            const user = UserModel.findById(req.user._id);
            let adminUser = UserModel.find({ isAdmin: true });

            // get email of user
            users.push(user.email);

            // now get emails of all admin users
            adminUser.forEach((user) => {
                users.push(user.email);
            });

            // send email to all users
            users.forEach((user) => {
                sendEmail(user, 'Your Query to Plixx!!', `Thank you for contacting us. We will get back to you soon.`);
            });
            res.json({ message: 'Query created' });
        }
        else {
            res.status(400);
            throw new Error('Invalid query data');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

    





export { registerUser , loginUser , updateUserProfile , deleteUser , changePassword , getUserLikedMovies , addLikedMovie, removeAllLikedMovies , getUsers , deleteUserById , deleteAllUsers, googleRegisterorLogin, sendOTP, removeLikedMovie, createQueryRequest };
