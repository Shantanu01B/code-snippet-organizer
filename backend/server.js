require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const authMiddleware = require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(cors());


const User = require('./models/User');
const bcrypt = require('bcryptjs');

mongoose.connection.once('open', async() => {
    const demoUser = await User.findOne({ username: 'demo' });
    if (!demoUser) {
        const hashed = await bcrypt.hash('demo123', 10);
        await User.create({ username: 'demo', password: hashed });
        console.log('Demo user created: demo / demo123');
    }
});

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err));

// Auth routes
app.use('/api/auth', authRoutes);

// Example protected route
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: `Hello, ${req.user.username}` });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));