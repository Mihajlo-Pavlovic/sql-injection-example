const express = require('express');
const bodyParser = require('body-parser');
const db = require('./sql-connector.js'); 

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(express.static(__dirname)); 

app.post('/unsafe-login', async (req, res) => {
  const { username, password } = req.body;

  const unsafeQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  try {
    const rows = await db.query(unsafeQuery);
    if (rows.length > 0) {
       res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Error executing query:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/safe-login', async (req, res) => {
  const { username, password } = req.body;

  const safeQuery = `SELECT * FROM users WHERE username = ? AND password = ?`;

  try {
    const rows = await db.query(safeQuery, [username, password]);
    if (rows.length > 0) {
       res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Error executing query:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
(async () => {
  try {
    await db.initialize();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error initializing database:', err.message);
  }
})();
