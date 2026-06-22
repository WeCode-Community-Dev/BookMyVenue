import express from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware";

const app = express();

app.listen(8000, () => {
  console.log("Port is listening at port 8000");
});



app.use(errorHandler)