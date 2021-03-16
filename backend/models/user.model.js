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
  isBuilding: {
    type: Boolean,
    required: false,
  },
  setupID: {
    type: String,
    required: false,
    unique: false,
    trim: true
  },
  url: {
    type: String,
    required: false,
    trim: true,
    minlength: 3
  },
  challenges: [Challenge]
}, {
  timestamps: true,
});

module.exports = User = mongoose.model("users", UserSchema);