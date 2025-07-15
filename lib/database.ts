import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

// Ensure data directory exists
const dataDir = path.join(process.cwd(), "data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, "appointments.db")

let db: Database.Database

try {
  db = new Database(dbPath)
  // Enable foreign keys
  db.pragma("foreign_keys = ON")
  console.log("Database connected successfully at:", dbPath)
} catch (error) {
  console.error("Failed to connect to database:", error)
  throw error
}

// Initialize database tables
const initDB = () => {
  try {
    // Create tables
    db.exec(`
      CREATE TABLE IF NOT EXISTS clinics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        specialization TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        date_of_birth DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        clinic_id INTEGER NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'completed', 'cancelled')),
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id),
        FOREIGN KEY (clinic_id) REFERENCES clinics(id)
      );
    `)

    // Check if we need to seed data
    const clinicCount = db.prepare("SELECT COUNT(*) as count FROM clinics").get() as { count: number }

    if (clinicCount.count === 0) {
      console.log("Seeding database with initial data...")

      // Insert sample clinics
      const insertClinic = db.prepare(`
        INSERT INTO clinics (name, address, phone, email, specialization) 
        VALUES (?, ?, ?, ?, ?)
      `)

      const clinics = [
        ["City Medical Center", "123 Main St, Downtown", "(555) 123-4567", "info@citymedical.com", "General Medicine"],
        ["Heart Care Clinic", "456 Oak Ave, Midtown", "(555) 234-5678", "contact@heartcare.com", "Cardiology"],
        ["Dental Excellence", "789 Pine Rd, Uptown", "(555) 345-6789", "hello@dentalexcellence.com", "Dentistry"],
        ["Eye Care Center", "321 Elm St, Westside", "(555) 456-7890", "info@eyecare.com", "Ophthalmology"],
        ["Pediatric Clinic", "654 Maple Dr, Eastside", "(555) 567-8901", "care@pediatric.com", "Pediatrics"],
      ]

      clinics.forEach((clinic) => {
        insertClinic.run(...clinic)
      })

      // Insert sample patients
      const insertPatient = db.prepare(`
        INSERT INTO patients (name, email, phone, date_of_birth) 
        VALUES (?, ?, ?, ?)
      `)

      const patients = [
        ["John Smith", "john.smith@email.com", "(555) 111-2222", "1985-03-15"],
        ["Sarah Johnson", "sarah.j@email.com", "(555) 222-3333", "1990-07-22"],
        ["Michael Brown", "mike.brown@email.com", "(555) 333-4444", "1978-11-08"],
        ["Emily Davis", "emily.davis@email.com", "(555) 444-5555", "1992-05-30"],
        ["David Wilson", "david.w@email.com", "(555) 555-6666", "1988-09-12"],
      ]

      patients.forEach((patient) => {
        insertPatient.run(...patient)
      })

      // Insert sample appointments
      const insertAppointment = db.prepare(`
        INSERT INTO appointments (patient_id, clinic_id, appointment_date, appointment_time, status, notes) 
        VALUES (?, ?, ?, ?, ?, ?)
      `)

      const appointments = [
        [1, 1, "2024-01-15", "09:00", "scheduled", "Regular checkup"],
        [2, 2, "2024-01-16", "10:30", "scheduled", "Heart consultation"],
        [3, 3, "2024-01-17", "14:00", "completed", "Dental cleaning"],
        [4, 4, "2024-01-18", "11:15", "scheduled", "Eye examination"],
        [5, 5, "2024-01-19", "15:30", "scheduled", "Child wellness visit"],
        [1, 3, "2024-01-20", "16:00", "scheduled", "Dental checkup"],
        [2, 1, "2024-01-21", "08:30", "cancelled", "Patient cancelled"],
        [3, 2, "2024-01-22", "13:45", "scheduled", "Follow-up visit"],
      ]

      appointments.forEach((appointment) => {
        insertAppointment.run(...appointment)
      })

      console.log("Database seeded successfully")
    }
  } catch (error) {
    console.error("Failed to initialize database:", error)
    throw error
  }
}

// Initialize database on import
initDB()

export interface Clinic {
  id: number
  name: string
  address: string
  phone: string
  email: string
  specialization: string
  created_at: string
}

export interface Patient {
  id: number
  name: string
  email: string
  phone: string
  date_of_birth: string
  created_at: string
}

export interface Appointment {
  id: number
  patient_id: number
  clinic_id: number
  appointment_date: string
  appointment_time: string
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
  created_at: string
  patient_name?: string
  clinic_name?: string
}

export const clinicQueries = {
  getAll: () => {
    try {
      const stmt = db.prepare("SELECT * FROM clinics ORDER BY name")
      return stmt.all() as Clinic[]
    } catch (error) {
      console.error("Error fetching clinics:", error)
      throw error
    }
  },

  getById: (id: number) => {
    try {
      const stmt = db.prepare("SELECT * FROM clinics WHERE id = ?")
      return stmt.get(id) as Clinic | undefined
    } catch (error) {
      console.error("Error fetching clinic by id:", error)
      throw error
    }
  },

  create: (clinic: Omit<Clinic, "id" | "created_at">) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO clinics (name, address, phone, email, specialization)
        VALUES (?, ?, ?, ?, ?)
      `)
      const result = stmt.run(clinic.name, clinic.address, clinic.phone, clinic.email, clinic.specialization)
      return result.lastInsertRowid as number
    } catch (error) {
      console.error("Error creating clinic:", error)
      throw error
    }
  },

  update: (id: number, clinic: Omit<Clinic, "id" | "created_at">) => {
    try {
      const stmt = db.prepare(`
        UPDATE clinics 
        SET name = ?, address = ?, phone = ?, email = ?, specialization = ?
        WHERE id = ?
      `)
      const result = stmt.run(clinic.name, clinic.address, clinic.phone, clinic.email, clinic.specialization, id)
      return result.changes > 0
    } catch (error) {
      console.error("Error updating clinic:", error)
      throw error
    }
  },

  delete: (id: number) => {
    try {
      const stmt = db.prepare("DELETE FROM clinics WHERE id = ?")
      const result = stmt.run(id)
      return result.changes > 0
    } catch (error) {
      console.error("Error deleting clinic:", error)
      throw error
    }
  },
}

export const patientQueries = {
  getAll: () => {
    try {
      const stmt = db.prepare("SELECT * FROM patients ORDER BY name")
      return stmt.all() as Patient[]
    } catch (error) {
      console.error("Error fetching patients:", error)
      throw error
    }
  },

  getById: (id: number) => {
    try {
      const stmt = db.prepare("SELECT * FROM patients WHERE id = ?")
      return stmt.get(id) as Patient | undefined
    } catch (error) {
      console.error("Error fetching patient by id:", error)
      throw error
    }
  },

  getByEmail: (email: string) => {
    try {
      const stmt = db.prepare("SELECT * FROM patients WHERE email = ?")
      return stmt.get(email) as Patient | undefined
    } catch (error) {
      console.error("Error fetching patient by email:", error)
      throw error
    }
  },

  create: (patient: Omit<Patient, "id" | "created_at">) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO patients (name, email, phone, date_of_birth)
        VALUES (?, ?, ?, ?)
      `)
      const result = stmt.run(patient.name, patient.email, patient.phone, patient.date_of_birth)
      return result.lastInsertRowid as number
    } catch (error) {
      console.error("Error creating patient:", error)
      throw error
    }
  },
}

export const appointmentQueries = {
  getAll: () => {
    try {
      const stmt = db.prepare(`
        SELECT a.*, p.name as patient_name, c.name as clinic_name
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN clinics c ON a.clinic_id = c.id
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
      `)
      return stmt.all() as Appointment[]
    } catch (error) {
      console.error("Error fetching appointments:", error)
      throw error
    }
  },

  getByPatient: (patientId: number) => {
    try {
      const stmt = db.prepare(`
        SELECT a.*, c.name as clinic_name
        FROM appointments a
        JOIN clinics c ON a.clinic_id = c.id
        WHERE a.patient_id = ?
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
      `)
      return stmt.all(patientId) as Appointment[]
    } catch (error) {
      console.error("Error fetching appointments by patient:", error)
      throw error
    }
  },

  create: (appointment: Omit<Appointment, "id" | "created_at" | "patient_name" | "clinic_name">) => {
    try {
      console.log("Creating appointment with data:", appointment)

      const stmt = db.prepare(`
        INSERT INTO appointments (patient_id, clinic_id, appointment_date, appointment_time, status, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      const result = stmt.run(
        appointment.patient_id,
        appointment.clinic_id,
        appointment.appointment_date,
        appointment.appointment_time,
        appointment.status || "scheduled",
        appointment.notes || null,
      )

      console.log("Appointment created successfully, result:", result)
      return result.lastInsertRowid as number
    } catch (error) {
      console.error("Error creating appointment:", error)
      throw error
    }
  },

  getAnalytics: () => {
    try {
      const totalAppointments = db.prepare("SELECT COUNT(*) as count FROM appointments").get() as { count: number }
      const appointmentsByStatus = db
        .prepare(`
        SELECT status, COUNT(*) as count 
        FROM appointments 
        GROUP BY status
      `)
        .all() as { status: string; count: number }[]

      const appointmentsByClinic = db
        .prepare(`
        SELECT c.name, COUNT(a.id) as count
        FROM clinics c
        LEFT JOIN appointments a ON c.id = a.clinic_id
        GROUP BY c.id, c.name
        ORDER BY count DESC
      `)
        .all() as { name: string; count: number }[]

      const recentAppointments = db
        .prepare(`
        SELECT a.*, p.name as patient_name, c.name as clinic_name
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN clinics c ON a.clinic_id = c.id
        ORDER BY a.created_at DESC
        LIMIT 10
      `)
        .all() as Appointment[]

      return {
        totalAppointments: totalAppointments.count,
        appointmentsByStatus,
        appointmentsByClinic,
        recentAppointments,
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
      throw error
    }
  },
}

export default db
