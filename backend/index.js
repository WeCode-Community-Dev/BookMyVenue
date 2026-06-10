import express from 'express'
import dotenv from 'dotenv'
import routes from './src/routes/index.js'
import { globalErrorHandler } from './src/handlers/error_handlers.js';
import cors from "cors";
import cookieParser from 'cookie-parser';


dotenv.config()

const app = express();
const PORT = process.env.PORT || 5005;

app.use(express.json());

app.use(cookieParser());


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send('Server is up and running');
});

app.use(routes)

app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});