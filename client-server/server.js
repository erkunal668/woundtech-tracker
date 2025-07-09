const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const cliniciansRoutes = require('./routes/clinicians');
const patientsRoutes = require('./routes/patients');
const visitsRoutes = require('./routes/visits');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/clinicians', cliniciansRoutes);
app.use('/patients', patientsRoutes);
app.use('/visits', visitsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
