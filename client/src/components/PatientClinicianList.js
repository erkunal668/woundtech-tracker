import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PatientClinicianList({ setFilter, onChange }) {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({ patientName: '', clinicianName: '' });
  const [show, setShow] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/patients').then(res => setPatients(res.data));
  }, []);

  const addEntry = async () => {
    const { patientName, clinicianName } = formData;
    if (!patientName || !clinicianName) return;

    await axios.post('http://localhost:5000/patients', { ...formData });
    setFormData({ patientName: '', clinicianName: '' });
    const res = await axios.get('http://localhost:5000/patients');
    setPatients(res.data);
    if (onChange) onChange();
  };

  return (
    <div>
      <div className="patientListStyle">
        <input
          type="text"
          value={formData.patientName}
          onChange={e => setFormData({ ...formData, patientName: e.target.value })}
          placeholder="Patient name"
          className="border p-2"
        />
        <input
          type="text"
          value={formData.clinicianName}
          onChange={e => setFormData({ ...formData, clinicianName: e.target.value })}
          placeholder="Clinician name"
        />
        <div className="addShowBtnStyl">
          <button onClick={addEntry} >Add</button>
          <button onClick={() => setShow(prev => !prev)} className="">
            {show ? 'Hide Data' : 'Show Data'}
          </button>
        </div>
      </div>

      {show && (
        <ul className="mt-4">
          {patients.map(patient => (
            <li
              key={patient.id}
              className="cursor-pointer hover:underline"
              onClick={() => setFilter({ patientId: patient.id })}
            >
              {patient.patientName} ({patient.clinicianName})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PatientClinicianList;
