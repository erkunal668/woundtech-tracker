import React, { useState } from 'react';
import ClinicianList from './components/ClinicianList';
import PatientList from './components/PatientList';
import VisitForm from './components/VisitForm';
import VisitList from './components/VisitList';

function App() {
  const [refresh, setRefresh] = useState(0);
  const [filter, setFilter] = useState({ clinicianId: '', patientName: '' });
  const triggerRefresh = () => setRefresh(prev => prev + 1);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Patient Visit Tracker</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className='appStyle'>
          <div>
          <h2 className="text-xl font-semibold mb-2">Clinicians</h2>
          <ClinicianList setFilter={setFilter} onChange={triggerRefresh} />
          </div>
          <div>
          <h2 className="text-xl font-semibold mb-2 mt-4">Patients</h2>
          <PatientList setFilter={setFilter} onChange={triggerRefresh} />
          </div>
    

        </div>
        <div>
          <div className='record'>
          <h2 className="text-xl font-semibold mb-2 mt-4">Record Visit</h2>
          <VisitForm onSubmit={() => setRefresh(refresh + 1)} refresh={refresh} />
          </div>
          <h2 className="text-xl font-semibold mb-2">Visits</h2>
          <VisitList refresh={refresh} filter={filter} />
        </div>
      </div>
    </div>
  );
}

export default App;
