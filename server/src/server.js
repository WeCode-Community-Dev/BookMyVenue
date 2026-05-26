import express from 'express';
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'

const app = express()

dotenv.config()


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.get('/test', (req, res) => {
    res.status(200).json({
        status: true, 
        message: "Test route hit"
    })
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log('Server connected')
})