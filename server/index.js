import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
const app = express()

//! UserRoutes
import userRoutes from "./routes/userRoutes.js"

import connectDB from './config/db.js';

// Middlewares
import { notFound, errorHandler} from './middleware/errorMiddleware.js'

connectDB()
app.use(cors());
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cookieParser());


app.use('/user', userRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = 4200

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})