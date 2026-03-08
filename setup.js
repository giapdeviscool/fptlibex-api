
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './src/routes/index.js';
import express from 'express';
import 'dotenv/config';
const setupApi = (app) => {
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use('/api/v1', indexRouter);
}

const setupDB = async () => {
    const mongoUrl = process.env.MONGODB_URL;
    try {
       await mongoose.connect(mongoUrl);
       console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

export { setupApi, setupDB };