-- Insert sample clinics
INSERT INTO clinics (name, address, phone, email, specialization) VALUES
('City Medical Center', '123 Main St, Downtown', '(555) 123-4567', 'info@citymedical.com', 'General Medicine'),
('Heart Care Clinic', '456 Oak Ave, Midtown', '(555) 234-5678', 'contact@heartcare.com', 'Cardiology'),
('Dental Excellence', '789 Pine Rd, Uptown', '(555) 345-6789', 'hello@dentalexcellence.com', 'Dentistry'),
('Eye Care Center', '321 Elm St, Westside', '(555) 456-7890', 'info@eyecare.com', 'Ophthalmology'),
('Pediatric Clinic', '654 Maple Dr, Eastside', '(555) 567-8901', 'care@pediatric.com', 'Pediatrics');

-- Insert sample patients
INSERT INTO patients (name, email, phone, date_of_birth) VALUES
('John Smith', 'john.smith@email.com', '(555) 111-2222', '1985-03-15'),
('Sarah Johnson', 'sarah.j@email.com', '(555) 222-3333', '1990-07-22'),
('Michael Brown', 'mike.brown@email.com', '(555) 333-4444', '1978-11-08'),
('Emily Davis', 'emily.davis@email.com', '(555) 444-5555', '1992-05-30'),
('David Wilson', 'david.w@email.com', '(555) 555-6666', '1988-09-12');

-- Insert sample appointments
INSERT INTO appointments (patient_id, clinic_id, appointment_date, appointment_time, status, notes) VALUES
(1, 1, '2024-01-15', '09:00', 'scheduled', 'Regular checkup'),
(2, 2, '2024-01-16', '10:30', 'scheduled', 'Heart consultation'),
(3, 3, '2024-01-17', '14:00', 'completed', 'Dental cleaning'),
(4, 4, '2024-01-18', '11:15', 'scheduled', 'Eye examination'),
(5, 5, '2024-01-19', '15:30', 'scheduled', 'Child wellness visit'),
(1, 3, '2024-01-20', '16:00', 'scheduled', 'Dental checkup'),
(2, 1, '2024-01-21', '08:30', 'cancelled', 'Patient cancelled'),
(3, 2, '2024-01-22', '13:45', 'scheduled', 'Follow-up visit');
