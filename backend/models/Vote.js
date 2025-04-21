const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nomineeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nominee', required: true },
  position: { type: String, enum: ['president', 'vice-president', 'secretary', 'treasurer'], required: true },
});

module.exports = mongoose.model('Vote', voteSchema);