const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Create new patient with clinician name
router.post('/', (req, res) => {
  const { patientName, clinicianName } = req.body;
  db.run(
    'INSERT INTO patients (patientName, clinicianName) VALUES (?, ?)',
    [patientName, clinicianName],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});


// Get all patients (with clinician names)
router.get('/', (req, res) => {
  db.all(`SELECT * FROM patients`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
