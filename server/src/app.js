const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json()); // Parses incoming JSON

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./routes/authRoutes')); 
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

module.exports = app;

