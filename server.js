const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Bootcamp = require('./models/Bootcamp');
const app = express();

require('dotenv').config();

const port = process.env.PORT || 3000;

// Middleware to serve static files (optional)
app.use(express.json());

// Middleware for logging requests
app.use(morgan('dev'));


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, Worrld!');
});



// Create Bootcamp (POST)
app.post('/api/bootcamps', async (req, res) => {
  try {
    const { name, location, description, website } = req.body;

    // Create a new Bootcamp
    const newBootcamp = new Bootcamp({
      name,
      location,
      description,
      website
    });

    // Save the Bootcamp to the database
    await newBootcamp.save();

    res.status(201).json(newBootcamp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get All Bootcamps (GET)
app.get('/api/bootcamps', async (req, res) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.json(bootcamps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Bootcamp by ID (GET)
app.get('/api/bootcamps/:id', async (req, res) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res.status(404).json({ message: 'Bootcamp not found' });
    }
    res.json(bootcamp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Update Bootcamp (PUT)
app.put('/api/bootcamps/:id', async (req, res) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bootcamp) {
      return res.status(404).json({ message: 'Bootcamp not found' });
    }
    res.json(bootcamp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Delete Bootcamp (DELETE)
app.delete('/api/bootcamps/:id', async (req, res) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return res.status(404).json({ message: 'Bootcamp not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});




// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
