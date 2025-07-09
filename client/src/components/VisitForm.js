import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VisitForm({ onSubmit, refresh }) {
  const [clinicians, setClinicians] = useState([]);
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({ clinicianId: '', patientId: '', notes: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/clinicians').then(res => setClinicians(res.data));
    axios.get('http://localhost:5000/patients').then(res => setPatients(res.data));
  }, [refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.clinicianId || !formData.patientId) {
      alert('Please select both clinician and patient');
      return;
    }

    try {
      await axios.post('http://localhost:5000/visits', {
        clinician_id: formData.clinicianId,
        patient_id: formData.patientId,
        notes: formData.notes
      });

      setFormData({ clinicianId: '', patientId: '', notes: '' });
      onSubmit(); // trigger refresh
    } catch (err) {
      console.error('Error saving visit:', err);
      alert('Failed to save visit.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <div className='appStyle'>
      <div >
        <label className="block">Clinician</label>
        <select
          value={formData.clinicianId}
          onChange={e => setFormData({ ...formData, clinicianId: e.target.value })}
          className="border p-2 w-full"
        >
          <option value="">Select Clinician</option>
          {clinicians.map(clinician => (
            <option key={clinician.id} value={clinician.id}>
              {clinician.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block">Patient</label>
        <select
          value={formData.patientId}
          onChange={e => setFormData({ ...formData, patientId: e.target.value })}
          className="border p-2 w-full"
        >
          <option value="">Select Patient</option>
          {patients.map(patient => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
      </div>
      </div>
      <div>
        <label className="block">Notes</label>
        <textarea
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
          className="border p-2 w-full"
        />
      </div>
      <button type="submit" className="">
        Record Visit
      </button>
    </form>
  );
}

export default VisitForm;
