const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BootcampSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a name for the bootcamp'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  location: {
    type: String,
    required: [true, 'Please add a location for the bootcamp'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description for the bootcamp'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  website: {
    type: String,
    required: [true, 'Please add a website for the bootcamp'],
    match: [
      /https?:\/\/(www\.)?[\w\-]+\.[a-z]{2,3}(\.[a-z]{2})?(\S+)?/,
      'Please add a valid URL'
    ]
  }
});

const Bootcamp = mongoose.model('Bootcamp', BootcampSchema);

module.exports = Bootcamp;

