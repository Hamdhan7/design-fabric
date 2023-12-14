const express = require('express');
const router = express.Router();
const db = require('../config/database');




router.post('/register', async (req, res) => {
    try {
        const { name, password, address, phone } = req.body;

        // Insert user into the database
        await db.query('INSERT INTO User (name, password, address, phoneNumber) VALUES (?, ?, ?, ?)', [name, password, address, phone]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
//     // Assuming passport authentication has been set up correctly
//     const token = jwt.sign({ sub: req.user.id }, 'your-secret-key', { expiresIn: '1h' });
//     res.json({ token: req.user });
//     res.json({ token });
// });

// Login route
// Login endpoint
// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;

        // Query to check if the user exists with the provided name and password

        const result = await db.query('SELECT * FROM User WHERE Name = ? AND Password = ?', ['user9', 'testpassword']);
        if (result instanceof Error) {
            console.error('Error during query:', result.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        // const result = await db.query('SELECT * FROM User WHERE Name = ? AND Password = ?', [name, password]);

        
        console.log(result);
        // // Check if the query was successful and if there are rows
        // if (result && result[0] && result[0].length > 0) {
        //     const user = result[0][0]; // Assuming the user is the first row
        //     res.status(200).json({ message: 'Login successful', user });
        // } else {
        //     res.status(401).json({ message: 'Invalid name or password' });
        // }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
