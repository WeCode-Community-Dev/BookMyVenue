const express = require('express');
const cors = require('cors')
const dbConnect = require('./config/dbConnect')
const app = express();
require('dotenv').config()


app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//routes
const venueRouter = require('./Routes/venueRoutes')


const port = process.env.PORT

dbConnect()





app.use('/api/venue', venueRouter)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});