import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VisitList({ refresh, filter }) {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    const query = filter.clinicianId
      ? `?clinicianId=${filter.clinicianId}`
      : filter.patientId
      ? `?patientId=${filter.patientId}`
      : '';
    axios.get(`http://localhost:5000/visits${query}`).then(res => setVisits(res.data));
  }, [refresh, filter]);

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Clinician</th>
          <th>Patient</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {visits.map(visit => (
          <tr key={visit.id}>
            <td>{new Date(visit.timestamp).toLocaleString()}</td>
            <td>{visit.clinicianName}</td>
            <td>{visit.patientName}</td>
            <td>{visit.notes || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default VisitList;