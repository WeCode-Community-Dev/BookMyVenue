import dotenv from 'dotenv'
dotenv.config()

import express from 'express';
import cookieParser from 'cookie-parser'
import cors from 'cors'
// import passport from './infrastructure/config/passport.config.js'  // TODO: Google Auth - temporarily disabled
import routes from './presentation/routes/index.js'
import { connectDB } from './infrastructure/config/mongo.config.js';
import cloudinaryUpload from "./presentation/middlewares/cloudinaryUpload.js";

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
// app.use(passport.initialize())  // TODO: Google Auth - temporarily disabled


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

connectDB()

app.post(
  "/test-upload",
  cloudinaryUpload("bookmyvenue/test").single("image"),
  (req, res) => {
    res.status(200).json({
      success: true,
      file: req.file,
    });
  }
);

app.get('/test', (req, res) => {
    res.status(200).json({
        status: true, 
        message: "Test route hit"
    })
})

app.use('/api', routes)
const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log('Server connected')
})