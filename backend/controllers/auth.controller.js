const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async(req, res) => {
    try {
        const { username, password } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashed });
        res.json({ message: 'User created', user: { username: user.username } });
    } catch (err) {
        res.status(400).json({ error: 'Username already exists' });
    }
};

exports.signin = async(req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id, username: user.username },
        process.env.JWT_SECRET, { expiresIn: '2h' }
    );
    res.json({ token, username: user.username });
};