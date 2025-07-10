import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ClinicianList({ setFilter, onChange }) {
  const [clinicians, setClinicians] = useState([]);
  const [name, setName] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/clinicians').then(res => setClinicians(res.data));
  }, []);

  const addClinician = async () => {
    if (!name) return;
    await axios.post('http://localhost:5000/clinicians', { name });
    setName('');
    const res = await axios.get('http://localhost:5000/clinicians');
    setClinicians(res.data);
    if (onChange) onChange(); 
    
  };

  

  return (
    <div>
      <div className="clinical">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Clinician name"
          className="border p-2 mr-2"
        />
        <button onClick={addClinician} >
          Add
        </button>
        <button onClick={() => show ? setShow(false) : setShow(true)} >
         {!show ? "Show Data" : "Hide Data"} 
        </button>
      </div>
      
     {   show &&
      <ul>
        {clinicians.map(clinician => (
          <li
            key={clinician.id}
            className="cursor-pointer hover:underline"
            onClick={() => setFilter({ clinicianId: clinician.id, patientId: '' })}
          >
            {clinician.name}
          </li>
        ))}
      </ul>
}
    </div>
  );
}

export default ClinicianList;
