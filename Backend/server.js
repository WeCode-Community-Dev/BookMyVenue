const express = require('express');
const dbConnect = require('./config/dbConnect')
const app = express();
require('dotenv').config()

dbConnect()
const port = process.env.PORT
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});