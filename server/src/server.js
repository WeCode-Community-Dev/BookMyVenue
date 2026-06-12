import dotenv from 'dotenv';
import app from './app.js';
import Authrouter from './modules/auth/auth.routes.js';
import Venuerouter from './modules/venues/venues.routes.js';

dotenv.config();

const PORT = process.env.PORT || 4000;
app.use("/auth", Authrouter);
app.use("/api/venues", Venuerouter);
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});