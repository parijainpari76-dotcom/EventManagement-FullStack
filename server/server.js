const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/booking');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

// Database Connection
mongoose.connect(
    process.env.MONGO_URI ||
    process.env.MONGODB_URL ||
    'mongodb://localhost:27017/eventmang'
)
.then(async () => {
    console.log('connected to mongoDB');

    console.log(
        'DATABASE:',
        mongoose.connection.db.databaseName
    );

    console.log(
        'HOST:',
        mongoose.connection.host
    );

    console.log(
        'EVENT COUNT:',
        await mongoose.connection.db
            .collection('events')
            .countDocuments()
    );

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error('Error connecting to mongoDB:', error);
    process.exit(1);
});