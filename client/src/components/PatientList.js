import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PatientList({ setFilter, onChange }) {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/patients').then(res => setPatients(res.data));
  }, []);

  const addPatient = async () => {
    if (!name) return;
    await axios.post('http://localhost:5000/patients', { name });
    setName('');
    const res = await axios.get('http://localhost:5000/patients');
    setPatients(res.data);
    if (onChange) onChange(); 
  };

  return (
    <div>
      <div className="clinical">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Patient name"
        />
        <button onClick={addPatient}>
          Add
        </button>
        <button onClick={() => show ? setShow(false) : setShow(true)} >
         {!show ? "Show Data" : "Hide Data"} 
        </button>
      </div>
       { show && <ul>
        {patients.map(patient => (
          <li
            key={patient.id}
            className="cursor-pointer hover:underline"
            onClick={() => setFilter({ clinicianId: '', patientId: patient.id })}
          >
            {patient.name}
          </li>
        ))}
      </ul>
}
    </div>
  );
}

export default PatientList;
