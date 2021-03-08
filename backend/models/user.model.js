const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Challenge = require('../models/challenge.model').schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  url: {
    type: String,
    required: false,
    unique: true,
    trim: true,
    minlength: 3
  },
  challenges: [Challenge]
}, {
  timestamps: true,
});

module.exports = User = mongoose.model("users", UserSchema);