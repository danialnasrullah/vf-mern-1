// routes/courseRoutes.js
const express = require('express');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const router = express.Router();
const User = require('../models/User');
const { authenticateJWT, authorize } = require('./auth');
const { body, validationResult } = require('express-validator');

// @route   POST /api/courses
// @desc    Create a new course (Teacher only)
// @access  Private (Teacher)
router.post(
  '/api/courses',
  authenticateJWT,
  authorize('teacher'),
  [
    body('title').trim().notEmpty().withMessage('Course title is required'),
    body('description').trim().notEmpty().withMessage('Course description is required'),
    body('bootcamp').isMongoId().withMessage('Valid bootcamp ID is required'),
    body('duration').trim().notEmpty().withMessage('Course duration is required'),
    body('difficulty').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Difficulty must be Beginner, Intermediate, or Advanced')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { title, description, bootcamp, duration, difficulty, students } = req.body;
      
      // Automatically set the teacher as the authenticated user
      const teacher = req.user.userId;
      
      console.log('JWT decoded user:', req.user);
      console.log('Teacher ID from JWT:', teacher);

      // Validate that the teacher user exists and is actually a teacher
      const teacherUser = await User.findById(teacher);
      console.log('Found teacher user:', teacherUser);
      
      if (!teacherUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Teacher user not found' 
        });
      }
      
      if (teacherUser.role !== 'teacher') {
        return res.status(400).json({ 
          success: false, 
          message: 'User is not a teacher' 
        });
      }

      // Check if the Bootcamp exists
      const bootcampExists = await Bootcamp.findById(bootcamp);
      if (!bootcampExists) {
        return res.status(404).json({
          success: false,
          message: 'Bootcamp not found'
        });
      }

      // Validate students if provided
      if (students && students.length > 0) {
        const studentUsers = await User.find({ _id: { $in: students }, role: 'student' });
        if (studentUsers.length !== students.length) {
          return res.status(400).json({ 
            success: false, 
            message: 'One or more student IDs are invalid' 
          });
        }
      }

      // Create the course
      const course = new Course({
        title,
        description,
        bootcamp,
        duration,
        difficulty,
        teacher, // This is now automatically set from the authenticated user
        students: students || []
      });

      await course.save();
      
      // Populate the course with related data before sending response
      await course.populate('bootcamp', 'name location');
      await course.populate('teacher', 'name email');
      await course.populate('students', 'name email');

      res.status(201).json({
        success: true,
        data: course
      });
    } catch (err) {
      console.error('Course creation error:', err);
      res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
);

// Get all courses for a specific bootcamp
router.get('/api/bootcamps/:bootcampId/courses', async (req, res) => {
  try {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    if (!courses.length) {
      return res.status(404).json({
        success: false,
        message: 'No courses found for this bootcamp'
      });
    }

    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single course by ID
router.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    .populate('bootcamp')
    .populate('teacher', 'name email') // Only select name and email
    .populate('students', 'name email'); // Only select name and email

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all courses for a specific student
router.get('/api/students/:studentId/courses', async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    const courses = await Course.find({ students: student._id });
    res.status(200).json({ success: true, student, courses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all courses for a specific teacher
router.get('/api/teachers/:teacherId/courses', async (req, res) => {
  try {
    const teacher = await User.findById(req.params.teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }
    const courses = await Course.find({ teacher: teacher._id });
    res.status(200).json({ success: true, teacher, courses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a course
router.put('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a course
router.delete('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


