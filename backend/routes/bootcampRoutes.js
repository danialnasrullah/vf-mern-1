// routes/bootcampRoutes.js
const express = require('express');
const Bootcamp = require('../models/Bootcamp');
const router = express.Router();
const { authenticateJWT, authorize } = require('./auth');
const { body, validationResult } = require('express-validator');

// @route   POST /api/bootcamps
// @desc    Create a new bootcamp (Teacher only)
// @access  Private (Teacher)
router.post(
  '/api/bootcamps',
  authenticateJWT,
  authorize('teacher'),
  [
    body('name').trim().notEmpty().withMessage('Bootcamp name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('website').isURL().withMessage('Please provide a valid website URL')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, location, description, website } = req.body;

      // Check if bootcamp with same name already exists
      const existingBootcamp = await Bootcamp.findOne({ name });
      if (existingBootcamp) {
        return res.status(400).json({ 
          success: false, 
          message: 'A bootcamp with this name already exists' 
        });
      }

      // Create a new Bootcamp
      const newBootcamp = new Bootcamp({
        name,
        location,
        description,
        website
      });

      // Save the Bootcamp to the database
      await newBootcamp.save();

      res.status(201).json({
        success: true,
        data: newBootcamp
      });
    } catch (err) {
      res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
);

// @route   GET /api/bootcamps
// @desc    Get all bootcamps
// @access  Public
router.get('/api/bootcamps', async (req, res) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// @route   GET /api/bootcamps/:id
// @desc    Get bootcamp by ID
// @access  Public
router.get('/api/bootcamps/:id', async (req, res) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return res.status(404).json({ 
        success: false, 
        message: 'Bootcamp not found' 
      });
    }
    res.status(200).json({
      success: true,
      data: bootcamp
    });
  } catch (err) {
    res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// @route   PUT /api/bootcamps/:id
// @desc    Update bootcamp (Teacher only)
// @access  Private (Teacher)
router.put(
  '/api/bootcamps/:id',
  authenticateJWT,
  authorize('teacher'),
  async (req, res) => {
    try {
      const bootcamp = await Bootcamp.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }
      );
      
      if (!bootcamp) {
        return res.status(404).json({ 
          success: false, 
          message: 'Bootcamp not found' 
        });
      }
      
      res.status(200).json({
        success: true,
        data: bootcamp
      });
    } catch (err) {
      res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
);

// @route   DELETE /api/bootcamps/:id
// @desc    Delete bootcamp (Teacher only)
// @access  Private (Teacher)
router.delete(
  '/api/bootcamps/:id',
  authenticateJWT,
  authorize('teacher'),
  async (req, res) => {
    try {
      const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
      
      if (!bootcamp) {
        return res.status(404).json({ 
          success: false, 
          message: 'Bootcamp not found' 
        });
      }
      
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
);

module.exports = router;

