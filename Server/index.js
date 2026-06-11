import 'dotenv/config'
import express from "express"
import connectDB from './Config/DB_config.js'
import { apiRouter } from './Routes/index.js'


const app = express()


connectDB()
app.use('api', apiRouter)

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`server running on ${PORT}...`);
    
})