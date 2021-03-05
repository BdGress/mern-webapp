const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const challengeSchema = new Schema({
  challengeName: String,
  challengeSuccess: Boolean
})

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;