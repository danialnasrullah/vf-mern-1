const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');
const bootcampRoutes = require('./routes/bootcampRoutes');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
// const mongoSanitize = require('express-mongo-sanitize'); // Removing this
require('dotenv').config();

const port = process.env.PORT || 3000;

// --- MIDDLEWARE ---
// Middleware must be registered in the correct order to function properly.

// 1. Enable CORS for all requests
app.use(cors());

// 2. Set security HTTP headers
app.use(helmet());

// 3. Body parser, reading data from body into req.body
app.use(express.json());

// 4. Sanitize user input to prevent NoSQL injection attacks
// This should come after the body parser.
/* app.use(
  mongoSanitize({
    replaceWith: '_', // Use the recommended `replaceWith` option
  })
); */

// 5. Logger for development
app.use(morgan('dev'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply the rate limiting middleware to all requests
app.use(limiter);


// --- ROUTES ---
// Mount routers after all the global middleware.
app.use(courseRoutes);
app.use(userRoutes);
app.use(bootcampRoutes);


// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));


// --- BASIC ROUTE & SERVER START ---

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
// NOTE: There should only be ONE app.listen call in your application.
const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Gracefully handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
