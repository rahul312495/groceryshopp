require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:3000', 
  'https://groceryshopp.onrender.com' // Your deployed frontend
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true // allow cookies if needed
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/stats', require('./routes/stats'));

// Health check route
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));