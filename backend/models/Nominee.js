const mongoose = require('mongoose');

const nomineeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, enum: ['president', 'vice-president', 'secretary', 'treasurer'], required: true },
  approved: { type: Boolean, default: true },
});

module.exports = mongoose.model('Nominee', nomineeSchema);