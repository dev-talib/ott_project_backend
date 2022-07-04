const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/signup', (req, res) => {
    console.log(req.body);
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                res.status(400).json({ message: 'Email already exists' });
            } else {
                const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                });
                newUser.save()
                    .then(user => {
                        res.status(201).json({ message: 'User created successfully' });
                    })
                    .catch(err => {
                        res.status(500).json({ message: 'Error creating user' });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Error creating user' });
        });
    
});

router.post('/login', async(req, res) => {
    console.log(req.body);
    const user = await User.findOne({ $or : [{ email: req.body.email }, { username: req.body.email }] });
    if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
    }
    const isMatch = await (user.password === req.body.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    console.log(token);
    res.json({ user: {token:token, _id: user._id, username: user.username, email: user.email } });
});

router.post('/auth', (req, res) => {
    const token = req.body.token;
    if (!token) return res.status(401).json({ auth: false });
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        res.json({ auth: true, user: verified });
    } catch (err) {
        res.status(400).json({ auth: false });
    }
}); 
    



module.exports = router;