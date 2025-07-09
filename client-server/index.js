const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

const cliniciansRoutes = require('./routes/clinicians');
const patientsRoutes = require('./routes/patients');
const visitsRoutes = require('./routes/visits');

app.use(cors());
app.use(express.json());

// API routes
app.use('/clinicians', cliniciansRoutes);
app.use('/patients', patientsRoutes);
app.use('/visits', visitsRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
