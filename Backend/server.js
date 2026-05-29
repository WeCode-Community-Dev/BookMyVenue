const express = require('express');
const dbConnect = require('./config/dbConnect')
const app = express();
require('dotenv').config()

//routes
const venueRouter = require('./Routes/venueRoutes')

dbConnect()

const port = process.env.PORT

app.use('/api/venue', venueRouter)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});