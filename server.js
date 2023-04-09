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
import loginMovieRouter from './Routes/LoginMovieRoutes.js';
import bunnyRouter from './Controllers/BunnyUploader.js';
import { createProxyMiddleware } from 'http-proxy-middleware';
dotenv.config();

const app = express();

app.use(cors({
    origin: 'https://plixx.co.in, https://www.plixx.co.in, https://www.plixx.co.in/*, http://localhost:3000, http://localhost:1001',
    credentials: true,
}));
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

app.use('/bunnycdn', createProxyMiddleware({
    target: 'https://storage.bunnycdn.com',
    changeOrigin: true,
    headers: {
        "AccessKey": "93a36ca2-a928-43ce-b6a6851c44b9-06d0-4523",
        'Access-Control-Allow-Origin': 'https://storage.bunnycdn.com, https://plixx.co.in, https://plixx.co.in/bunnycdn, http://localhost:3000, http://localhost:1001, https://www.plixx.co.in, https://www.plixx.co.in/*',
    'Access-Control-Allow-Headers': 'access-control-allow-origin',
    },
    pathRewrite: {
        '^/bunnycdn': ''
    },
}));

app.use('/api/users', userRouter);
app.use('/api/movies', movieRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/mov', movRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/trailer', trailerRouter);
app.use('/api/loginMovies', loginMovieRouter);
app.use('/api/bunny', bunnyRouter);

app.use(errorHandler);

let PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);
