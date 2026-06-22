import express from "express";

import { errorHandler } from "./middlewares/errorHandler.middleware";
import { Env } from "./config/env.config";

const app = express();

app.listen(Env.PORT, () => {
  console.log(`Server is running on port:${Env.PORT} in ${Env.NODE_ENV} mode`);
});

app.use(errorHandler);
