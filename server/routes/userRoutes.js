const express = require('express');
const router = express.Router();  
const userModel = require('../models/userModel.js')
const cors = require("cors");
  
router.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
  
  
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


module.exports = router;

