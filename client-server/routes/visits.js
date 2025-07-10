const express = require('express');
const router = express.Router();
const db = require('../db/db'); 

router.post('/', (req, res) => {
  const { clinician_id, patient_id, notes } = req.body;

  if (!clinician_id || !patient_id) {
    return res.status(400).json({ error: 'clinician_id and patient_id are required.' });
  }

  const timestamp = new Date().toISOString();

  const sql = `INSERT INTO visits (clinician_id, patient_id, timestamp, notes)
               VALUES (?, ?, ?, ?)`;

  db.run(sql, [clinician_id, patient_id, timestamp, notes], function (err) {
    if (err) {
      console.error('DB Insert Error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});




// GET /visits — fetch all visits with names
router.get('/', (req, res) => {
  const { clinicianId, patientId } = req.query;

  let query = `
    SELECT visits.id, visits.timestamp, visits.notes,
           clinicians.name AS clinicianName,
           patients.name AS patientName
    FROM visits
    JOIN clinicians ON clinicians.id = visits.clinician_id
    JOIN patients ON patients.id = visits.patient_id
  `;

  const params = [];

  if (clinicianId) {
    query += ` WHERE visits.clinician_id = ?`;
    params.push(clinicianId);
  } else if (patientId) {
    query += ` WHERE visits.patient_id = ?`;
    params.push(patientId);
  }

  // query += ` ORDER BY visits.timestamp DESC`;

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


module.exports = router;
