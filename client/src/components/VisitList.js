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
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">Date</th>
          <th className="border p-2">Clinician</th>
          <th className="border p-2">Patient</th>
          <th className="border p-2">Notes</th>
        </tr>
      </thead>
      <tbody>
        {visits.map(visit => (
          <tr key={visit.id}>
            <td className="border p-2">{new Date(visit.timestamp).toLocaleString()}</td>
            <td className="border p-2">{visit.clinicianName}</td>
            <td className="border p-2">{visit.patientName}</td>
            <td className="border p-2">{visit.notes || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default VisitList;