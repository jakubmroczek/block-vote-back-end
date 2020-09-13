const mongoose = require('../mongoose');

const voterSchema = new mongoose.Schema({
  publicKey: {
    type: String,
    lowercase: true,
    validate: {
      validator(str) {
        return /^0x[a-fA-F0-9]{40}$/.test(str);
      },
      message: props => `${props.value} is invalid public key`,
    },
    required: [true, 'Public key is required'],
  },
  electionIDs: [String],
});

module.exports = mongoose.model('Voter', voterSchema);
