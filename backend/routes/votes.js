const express = require('express');
const Vote = require('../models/Vote');
const User = require('../models/User');
const Nominee = require('../models/Nominee');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { nomineeId, position } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user.hasVoted) return res.status(400).json({ msg: 'You have already voted' });

    const nominee = await Nominee.findById(nomineeId);
    if (!nominee || nominee.position !== position || !nominee.approved) {
      return res.status(400).json({ msg: 'Invalid nominee' });
    }

    const vote = new Vote({ userId: req.user.id, nomineeId, position });
    await vote.save();

    user.hasVoted = true;
    await user.save();

    res.json({ msg: 'Vote cast successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/results', auth, adminAuth, async (req, res) => {
  try {
    const votes = await Vote.aggregate([
      { $group: { _id: { nomineeId: '$nomineeId', position: '$position' }, count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'nominees',
          localField: '_id.nomineeId',
          foreignField: '_id',
          as: 'nominee',
        },
      },
      { $unwind: '$nominee' },
    ]);
    res.json(votes);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;