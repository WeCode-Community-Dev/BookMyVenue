require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

const healthRouter = require('./routes/health.routes');
const dbRoutes = require('./routes/dbRoutes');
const getVenuesRouter = require('./routes/getVenues');
const bookingRouter = require('./routes/bookingRoutes')
const signupRouter = require('./routes/signupRouter');
const loginRouter = require('./routes/loginRouter');
const cancelBookingRouter = require('./routes/cancelBookingRoute');
const adminBookingRouter = require('./routes/adminBookingsRoute');
const getVenueById = require('./routes/getVenueById');
const ownerApi = require('./routes/ownerRoute');
const adminVenueAdding = require('./routes/addVenueByAdmin');

app.use(cors());
app.use(express.json());


app.use('/health', healthRouter);
app.use('/db', dbRoutes);
app.use('/venues', getVenuesRouter);
app.use('/booking', bookingRouter)
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/api', cancelBookingRouter);
app.use('/api', adminBookingRouter);
app.use('/api', getVenueById);
app.use('/api', ownerApi);
app.use('/api', adminVenueAdding);

app.get('/', (req, res) => {
    res.send('Hello, World! Your Express server is running.');
});

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});