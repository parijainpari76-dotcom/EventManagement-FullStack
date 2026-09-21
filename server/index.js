
require('dotenv').config();

console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

console.log("🔥 RUNNING FILE:", __filename);
console.log("🔥 CURRENT FOLDER:", process.cwd());



const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/booking');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

//Routes
app.use('/api/auth', authRoutes);

app.get('/api/test-events', (req, res) => {
    console.log("🔥 TEST EVENTS ROUTE HIT");

    res.json({
        message: "index.js is working"
    });
});

app.use('/api/events', eventRoutes);

app.use('/api/bookings', bookingRoutes);

app.use((req, res) => {
    console.log("🔥 UNMATCHED REQUEST:", req.method, req.originalUrl);

    res.status(404).json({
        message: "Route not found",
        method: req.method,
        url: req.originalUrl
    });
});

//connect to mongoDB 
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

    const PORT = 5001;

    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error('Error connecting to mongoDB:', error);
    process.exit(1);
});