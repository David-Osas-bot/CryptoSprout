const bcrypt = require('bcrypt');
const db = require('../config/db');

// REGISTER
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: 'All fields required' });

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword],
    (err) => {
      if (err) return res.status(500).json({ message: 'DB Error', error: err });
      res.json({ message: '✅ User registered successfully' });
    }
  );
};

// LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0)
      return res.status(400).json({ message: 'User not found' });

    const user = results[0];
    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass)
      return res.status(401).json({ message: 'Invalid password' });

    res.json({ message: '✅ Login successful', user: { id: user.id, username: user.username } });
  });
};
