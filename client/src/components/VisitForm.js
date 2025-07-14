import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VisitForm({ onSubmit, refresh }) {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({ patientId: '', clinicianId: '', notes: '' });
  const [filteredClinicians, setFilteredClinicians] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/patients').then(res => setPatients(res.data));
  }, [refresh]);

  const handlePatientChange = (e) => {
    const selectedId = e.target.value;
    const selectedPatient = patients.find(p => p.id === parseInt(selectedId));
    setFormData({ ...formData, patientId: selectedId, clinicianId: '' });
    console.log(selectedPatient);
    

    if (selectedPatient) {
      // Show clinician(s) linked to the selected patient
      const clinicians = patients
        .filter(p => p.patientName === selectedPatient.patientName)
        .map(p => ({ id: p.id, name: p.clinicianName }));

      setFilteredClinicians(clinicians);
    } else {
      setFilteredClinicians([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { patientId, clinicianId, notes } = formData;
    if (!clinicianId || !patientId) {
      alert("Please select both patient and clinician.");
      return;
    }

    try {
      await axios.post('http://localhost:5000/visits', {
        patient_id: parseInt(patientId),
        clinician_id: parseInt(clinicianId),
        notes
      });
      setFormData({ patientId: '', clinicianId: '', notes: '' });
      onSubmit();
    } catch (err) {
      console.error('Error saving visit:', err);
      alert('Failed to save visit.');
    }
  };

  console.log(filteredClinicians, "data");
  

  return (
    <form onSubmit={handleSubmit}>
      <div className="appStyle">
        <div>
          <label>Patient</label>
          <select value={formData.patientId} onChange={handlePatientChange}>
            <option value="">Select Patient</option>
            {[...new Set(patients.map(p => p.patientName))].map((name, idx) => (
              <option key={idx} value={patients.find(p => p.patientName === name)?.id}>
                {name}
              </option>
            ))}
          </select>
        </div>
          <div>
            <label>Clinician</label>
            <select
              value={formData.clinicianId}
              onChange={e => setFormData({ ...formData, clinicianId: e.target.value })}
            >
              <option value="">Select Clinician</option>
              {filteredClinicians.map(cl => (
                <option key={cl.id} value={cl.id}>
                  {cl.name}
                </option>
              ))}
            </select>
          </div>

      </div>
      <div>
        <label>Notes</label>
        <textarea
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
      <button type="submit">Record Visit</button>
    </form>
  );
}

export default VisitForm;
