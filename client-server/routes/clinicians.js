const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', (req, res) => {
  db.all('SELECT * FROM clinicians', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { name } = req.body;
  db.run('INSERT INTO clinicians (name) VALUES (?)', [name], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

module.exports = router;

