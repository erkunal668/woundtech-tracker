const express = require('express');
const router = express.Router();
const db = require('../db/db');

//  Create a visit
router.post('/', (req, res) => {
  const { clinician_id, patient_id, notes } = req.body;
  const timestamp = new Date().toISOString();

  if (!clinician_id || !patient_id) {
    return res.status(400).json({ error: "clinician_id and patient_id are required." });
  }

  db.run(
    `INSERT INTO visits (clinician_id, patient_id, timestamp, notes)
     VALUES (?, ?, ?, ?)`,
    [clinician_id, patient_id, timestamp, notes],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// ✅ Get all visits with clinicianName and patientName (from patients table)
router.get('/', (req, res) => {
  const query = `
    SELECT 
      visits.id,
      visits.timestamp,
      visits.notes,
      visits.clinician_id,
      visits.patient_id,
      p.patientName,
      p.clinicianName
    FROM visits
    LEFT JOIN patients p ON visits.patient_id = p.id
    ORDER BY visits.timestamp DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
