const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
// app.use('/api/gear', require('./routes/gear'));
app.use('/api/shakedown', require('./routes/shakedown'));
app.use('/api/lighterpack', require('./routes/lighterpack'));
app.use('/api/recommendations', require('./routes/gearRecommendation'));
app.use('/api/price-estimate', require('./routes/priceEstimator'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));