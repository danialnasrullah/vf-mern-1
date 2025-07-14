const express = require('express');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000;

// Middleware to serve static files (optional)
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, Worrld!');
});


// Dummy Bootcamps Array (simulating a database)
let bootcamps = [
  { id: 1, name: 'Code Academy', location: 'Online', description: 'Learn to code in 12 weeks', website: 'https://codeacademy.com' },
  { id: 2, name: 'Tech Bootcamp', location: 'NYC', description: 'Intensive tech training program', website: 'https://techbootcamp.com' },
];

// 1. **Create Bootcamp** (POST)
app.post('/api/bootcamps', (req, res) => {
  const { name, location, description, website } = req.body;
  const newBootcamp = { id: bootcamps.length + 1, name, location, description, website };
  bootcamps.push(newBootcamp);
  res.status(201).json(newBootcamp);  // Send the new bootcamp as response
});

// 2. **Get All Bootcamps** (GET)
app.get('/api/bootcamps', (req, res) => {
  res.json(bootcamps);
});

// 3. **Get Bootcamp by ID** (GET)
app.get('/api/bootcamps/:id', (req, res) => {
  const bootcamp = bootcamps.find(b => b.id === parseInt(req.params.id));
  if (!bootcamp) return res.status(404).json({ message: 'Bootcamp not found' });
  res.json(bootcamp);
});

// 4. **Update Bootcamp** (PUT)
app.put('/api/bootcamps/:id', (req, res) => {
  const bootcamp = bootcamps.find(b => b.id === parseInt(req.params.id));
  if (!bootcamp) return res.status(404).json({ message: 'Bootcamp not found' });

  const { name, location, description, website } = req.body;
  bootcamp.name = name || bootcamp.name;
  bootcamp.location = location || bootcamp.location;
  bootcamp.description = description || bootcamp.description;
  bootcamp.website = website || bootcamp.website;

  res.json(bootcamp);  // Send the updated bootcamp as response
});

// 5. **Delete Bootcamp** (DELETE)
app.delete('/api/bootcamps/:id', (req, res) => {
  const bootcampIndex = bootcamps.findIndex(b => b.id === parseInt(req.params.id));
  if (bootcampIndex === -1) return res.status(404).json({ message: 'Bootcamp not found' });

  bootcamps.splice(bootcampIndex, 1);  // Remove the bootcamp from the array
  res.status(204).send();  // No content to return
});




// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
