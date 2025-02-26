import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import adminRouter from './routes/admin.routes.js';
import cookieParser from 'cookie-parser';
import  cookies  from 'cookie-parser'
import path from 'path';
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 8000

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

  const __dirname = path.resolve();

const app = express();

app.use(cors({
  origin: 'https://mern-estate-frontend.netlify.app',
}))
app.use(express.json());

app.use(cookieParser());

app.use(cookies())

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/admin', adminRouter);


app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
