import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRouter from './Routes/UserRoutes.js';
import movieRouter from './Routes/MoviesRoutes.js';
import categoryRouter from './Routes/CategoriesRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import uploadRouter from "./Controllers/UploadFile.js";
import movRouter from "./Routes/movieroutes2.js";
import paymentRouter from './middleware/stripeMiddleware.js';
import trailerRouter from './Controllers/UploadTrailer.js';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({
    limit: '500mb',
    verify: function (req, res, buf) {
        if (req.originalUrl.startsWith('/webhook')) {
            req.rawBody = buf.toString();
        }
    },
}));

app.use(express.urlencoded({
    limit: '500mb',
    extended: true
}));

connectDB();

app.get('/', (req, res) => {
    res.send('Pallu, A Gift for you');
});

app.use('/api/users', userRouter);
app.use('/api/movies', movieRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/mov', movRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/trailer', trailerRouter);

app.use(errorHandler);

let PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);
