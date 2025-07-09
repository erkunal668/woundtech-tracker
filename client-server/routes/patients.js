const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/', (req, res) => {
  const { name } = req.body;
  db.run("INSERT INTO patients (name) VALUES (?)", [name], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

router.get('/', (req, res) => {
  db.all("SELECT * FROM patients", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
