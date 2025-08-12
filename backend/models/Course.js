// models/Course.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for the course'],
    trim: true,
    maxlength: [100, 'Title cannot be longer than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description for the course'],
    maxlength: [500, 'Description cannot be longer than 500 characters']
  },
  bootcamp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bootcamp', // Reference to the Bootcamp model
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  duration: {
    type: String,
    required: [true, 'Please specify the duration of the course']
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
