const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


const saltRounds = 12;

router.post('/sign-up', async (req, res) => {
    try {
        const userInDatabase = await User.findOne({ username: req.body.username });
        if (userInDatabase) {
            return res.status(409).json({error: 'Username already taken.'});
        }

        const displayNameInDatabase = await User.findOne({ displayName: req.body.displayName });
        if (displayNameInDatabase?.displayName) {
            return res.status(409).json({error: 'Displayname already taken.'});
        }

        const user = await User.create({
            username:req.body.username,
            displayName: req.body.displayName,
            email: req.body.email,
            hashedPassword: bcrypt.hashSync(req.body.password, saltRounds),
        });

        const payload = { 
            username: user.username,
            _id: user._id,
            displayName: user.displayName,
            email: user.email
        };

        const token = jwt.sign({ payload }, process.env.JWT_SECRET);

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/sign-in', async (req, res)  => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        };

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.hashedPassword);
        if (!isPasswordCorrect){
            return res.status(401).json({ error: 'Invalid credentials.' });
        };

        const payload = { 
            username: user.username,
            _id: user._id,
            displayName: user.displayName,
            email: user.email
        };

        const token = jwt.sign({ payload }, process.env.JWT_SECRET);
        
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;