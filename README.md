# 🩺 Woundtech Tracker App

This is a full-stack application to manage **Clinicians**, **Patients**, and **Visits** using:

- 📦 **Node.js + Express** (Backend with SQLite)
- ⚛️ **React.js** (Frontend)
- 🧾 **SQLite3** as the local database

---

## Features

- Add, list, and manage Clinicians
- Add, list, and manage Patients
- Record Visits between Clinicians and Patients with optional notes
- View Visits with filtering by Clinician or Patient
- Data persists in SQLite DB

---

##  Project Structure


client-server/ # Backend
  ── db/ # SQLite DB & schema
  ── routes/ # Express routes (clinicians, patients, visits)
  ── server.js # Backend entry
  package.json

 client/ # Frontend
 src/
  ── components/ # React components
  ── App.js
  ── package.json

 README.md
.gitignore


