import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const port = process.env.PORT || 3000;

connectDB();

app.listen(port, () => {
  console.log(`BookMyVenue backend listening on port ${port}`);
});