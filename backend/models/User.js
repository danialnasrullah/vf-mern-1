const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, enum: ['student', 'teacher'], required: true },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
