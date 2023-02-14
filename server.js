import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRouter from './Routes/UserRoutes.js';
import movieRouter from './Routes/MoviesRoutes.js';
import categoryRouter from './Routes/CategoriesRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import uploadRouter from "./Controllers/UploadFile.js"
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/users', userRouter);
app.use('/api/movies', movieRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/upload', uploadRouter);

app.use(errorHandler);

app.listen(8000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
    }
);
