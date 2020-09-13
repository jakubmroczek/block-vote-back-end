const mongoose = require('../mongoose');

const candidateSchema = new mongoose.Schema({
  name: String,
  surname: String,
});

const participantSchema = new mongoose.Schema({
  email: String,
});

const smartContractSchema = new mongoose.Schema({
  abi: String,
  bytecode: String,
  address: String,
});

const electionSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['New', 'Registration', 'Deployed', 'Finished'],
  },
  title: String,
  candidates: [candidateSchema],
  participants: [participantSchema],
  publicKeys: [String],
  secretTokens: [String],
  smartContract: smartContractSchema,
});

module.exports = mongoose.model('Election', electionSchema);
