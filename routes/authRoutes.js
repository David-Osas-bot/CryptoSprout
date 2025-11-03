const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const router = express.Router();

// ✅ REGISTER route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, 'g-recaptcha-response': token } = req.body;

    // Check all fields
    if (!username || !email || !password || !token) {
      return res.status(400).json({ message: 'All fields including reCAPTCHA are required.' });
    }

    // ✅ Verify reCAPTCHA with Google (using built-in fetch)
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;

    const response = await fetch(verifyUrl, { method: 'POST' });
    const data = await response.json();

    if (!data.success) {
      return res.status(400).json({ message: 'reCAPTCHA verification failed.' });
    }

    // ✅ Check if email already exists
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], async (err, results) => {
      if (err) {
        console.error('❌ Database error (check email):', err);
        return res.status(500).json({ message: 'Server error.' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Email already registered.' });
      }

      // ✅ Hash password securely
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Save new user
      const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(insertQuery, [username, email, hashedPassword], (err2) => {
        if (err2) {
          console.error('❌ Database error (insert user):', err2);
          return res.status(500).json({ message: 'Registration failed.' });
        }

        console.log(`✅ User registered: ${username}`);
        res.status(201).json({ message: 'Registration successful!' });
      });
    });
  } catch (err) {
    console.error('❌ Server error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
