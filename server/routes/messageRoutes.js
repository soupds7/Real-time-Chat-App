const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel.js');
const cors = require('cors');
const { sendPushNotification } = require('../sendNotification');


router.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// POST route to save message
router.post('/box', async (req, res) => {
  try {
    const { sender, receiver, text} = req.body;

    // Validate
    if (!sender || !receiver || !text) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const message = new Message({ sender, receiver, text });
    await message.save();


  

    
    res.status(201).json(message);
  } catch (error) {
    console.error("🔥 Error in POST /box:", error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


// GET all messages between two users
router.get('/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ createdAt: 1 }); // sorted chronologically

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;
