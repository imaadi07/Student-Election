const express = require('express');
const Nominee = require('../models/Nominee');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { name, position } = req.body;
  try {
    const nominee = new Nominee({ name, position });
    await nominee.save();
    res.json(nominee);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const nominees = await Nominee.find({ approved: true });
    res.json(nominees);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    await Nominee.findByIdAndUpdate(req.params.id, { approved: false });
    res.json({ msg: 'Nominee removed' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;