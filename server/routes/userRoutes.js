const express = require('express');
const router = express.Router();  
const userModel = require('../models/userModel.js')
const cors = require("cors");
  
router.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));


const { sendPushNotification } = require('../sendNotification');
// POST /api/user/send-notification - send push notification to a user
router.post('/send-notification', async (req, res) => {
    const { userId, title, body } = req.body;
    if (!userId || !title || !body) {
        return res.status(400).json({ error: 'userId, title, and body required' });
    }
    try {
        await sendPushNotification(userId, title, body);
        console.log("Sent");
        res.status(200).json({ message: 'Notification sent' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send notification', details: err.message });
    }
});
// POST /api/user/fcm-token - save or update FCM token for a user
router.post('/fcm-token', async (req, res) => {
    const { userId, fcmToken } = req.body;
    if (!userId || !fcmToken) {
        return res.status(400).json({ error: 'userId and fcmToken required' });
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.fcmToken = fcmToken;
        await user.save();
        res.status(200).json({ message: 'FCM token saved' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save FCM token' });
    }
});


router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    userModel.findOne({ email: email })
        .then(user => {
            if (user) {
                res.json("Already registered");
            } else {
                userModel.create(req.body)
                    .then(user => res.json(user))
                    .catch(err => res.json(err));
            }
        });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    userModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json(user); // <-- Return the user object here!
                } else {
                    res.json("Wrong Password");
                }
            } else {
                res.json("No records found! ");
            }
        });
});

// GET /api/user/name - fetch all user names
router.get('/name', async (req, res) => {
 try {
        const users = await userModel.find({}, 'name'); // only fetch name field
        res.status(200).json(users);
    } catch (error) {
        console.error("Failed to fetch names:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// POST /api/user/add-friend - add a friend by userId
router.post('/add-friend', async (req, res) => {
    const { userId, friendId } = req.body;
    if (!userId || !friendId) {
        return res.status(400).json({ error: 'userId and friendId required' });
    }
    try {
        // Add friendId to user's friends array if not already present
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (!user.friends.includes(friendId)) {
            user.friends.push(friendId);
            await user.save();
        }
        res.status(200).json({ message: 'Friend added', friends: user.friends });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add friend' });
    }
});

// GET /api/user/friends/:userId - get all friends for a user
router.get('/friends/:userId', async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userId).populate('friends', 'name email');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user.friends);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch friends' });
    }
});


module.exports = router;

