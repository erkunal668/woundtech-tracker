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


## 🚀 Getting Started

### 📌 Prerequisites

- Node.js v18+ or v20+
- npm (comes with Node.js)
- Git (to clone the repo)

---

## ⚙️ Backend Setup (Node.js + Express)

1. Open terminal in the **`client-server`** directory:

```bash
cd client-server
npm install

Start the React app:
npm start

Start the backend server:
npm run dev
