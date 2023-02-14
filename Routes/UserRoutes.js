import express from 'express';
import { registerUser, loginUser, updateUserProfile, deleteUser, changePassword, getUserLikedMovies, addLikedMovie, removeAllLikedMovies, getUsers, deleteUserById, deleteAllUsers  } from '../Controllers/UserController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile);
router.delete('/delete', protect, deleteUser);
router.put('/changePassword', protect, changePassword);
router.get('/likedMovies', protect, getUserLikedMovies);
router.put('/likedMovies', protect, addLikedMovie);
router.delete('/likedMovies', protect, removeAllLikedMovies);
router.get('/users', protect,  admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUserById);
router.delete('/users', protect, admin, deleteAllUsers);


export default router;