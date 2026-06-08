// src/server.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './src/config/db.js'
import authRoutes from './src/routes/authRoutes.js';
// Load environment variables
dotenv.config()

const app= express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

connectDB()
//routes
app.use('/api/auth',authRoutes)

app.get('/',(req,res)=>{
    res.json({message: 'BookMyVenue Backend is running successfully! 🚀'})
})

const PORT= process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server is connecting to PORT ${PORT}`);
})
// Routes will be added here later