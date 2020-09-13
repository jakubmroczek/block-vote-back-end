const mongoose = require('../mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  electionID: String,
  finishedElectionIDs: [String],
});

module.exports = mongoose.model('User', userSchema);
