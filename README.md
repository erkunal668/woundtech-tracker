# Healthcare Appointment Booking System

A full-stack web application for managing healthcare appointments, featuring a patient booking portal and an admin dashboard for data analysis and clinic management.

## Features

*   **Patient Portal**:
    *   Browse available clinics.
    *   Quick booking form for appointments.
    *   Detailed clinic information.
*   **Admin Dashboard**:
    *   Overview of key metrics (total appointments, patients, clinics, completion rate).
    *   Breakdown of appointments by status and clinic.
    *   Recent appointments list.
    *   Clinic management: Add, edit, and delete clinics.
*   **Robust Backend**:
    *   SQLite database for data storage.
    *   RESTful API endpoints for appointments and clinics.
    *   Server-side validation and error handling.
*   **Testing**: Comprehensive test suite for components and API endpoints.

## Technologies Used

*   **Next.js 15**: React framework for building the application.
*   **React**: Frontend library for UI.
*   **Tailwind CSS**: Utility-first CSS framework for styling.
*   **shadcn/ui**: Reusable UI components built with Radix UI and Tailwind CSS.
*   **SQLite**: Lightweight, file-based database for local data storage.
*   **Better SQLite3**: Node.js driver for SQLite.
*   **Jest & React Testing Library**: For unit and integration testing.

## Local Setup

Follow these steps to get the application up and running on your local machine.

### Prerequisites

*   Node.js (v18.x or higher)
*   npm (comes with Node.js) or yarn / pnpm

### Installation

1.  **Clone the repository (if applicable):**
    \`\`\`bash
    git clone <repository-url>
    cd healthcare-appointment-system


2.  **Install dependencies:**
    \`\`\`bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    \`\`\`

### Running the Application

1.  **Start the development server:**
    \`\`\`bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    \`\`\`
2.  Open your browser and navigate to `http://localhost:3000`.

The application will automatically initialize the SQLite database (`data/appointments.db`) and seed it with sample data on the first run.

### Database

The application uses a SQLite database located at `data/appointments.db`. This file is automatically created and populated with initial data when the application starts for the first time.

### Running Tests

To run the test suite, use the following command:

\`\`\`bash
npm test
# or
yarn test
# or
pnpm test
\`\`\`

To run tests in watch mode:

\`\`\`bash
npm run test:watch
# or
yarn test:watch
# or
pnpm test:watch
\`\`\`

To generate a test coverage report:

\`\`\`bash
npm run test:coverage
# or
yarn test:coverage
# or
pnpm test:coverage
\`\`\`

## Project Structure

\`\`\`
.
├── app/
│   ├── admin/                 # Admin dashboard pages and components
│   │   ├── clinics/           # Clinic management pages and forms
│   │   └── page.tsx           # Admin dashboard main page
│   ├── api/                   # Next.js API routes
│   │   ├── appointments/      # API for appointment management
│   │   │   └── route.ts
│   │   ├── clinics/           # API for clinic management
│   │   │   ├── [id]/route.ts
│   │   │   └── route.ts
│   │   └── test/route.ts      # API test endpoint
│   ├── patient/               # Patient portal pages and components
│   │   ├── book/[clinicId]/   # Appointment booking page
│   │   ├── quick-booking-form.tsx # Quick booking form component
│   │   ├── success/page.tsx   # Appointment success page
│   │   └── page.tsx           # Patient portal main page
│   ├── globals.css            # Global CSS styles
│   ├── layout.tsx             # Root layout for the application
│   └── page.tsx               # Home page
├── components/
│   └── ui/                    # shadcn/ui components
├── data/                      # Directory for SQLite database file
├── lib/
│   └── database.ts            # Database connection and query logic
├── __tests__/                 # Jest test files
│   ├── api/
│   │   └── appointments.test.tsx
│   └── components/
│       ├── AddClinicForm.test.tsx
│       └── QuickBookingForm.test.tsx
├── jest.config.js             # Jest configuration
├── jest.setup.js              # Jest setup file
├── middleware.ts              # Next.js middleware
├── next.config.js             # Next.js configuration
├── package.json               # Project dependencies and scripts
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
\`\`\`

## Deployment

This application is designed to be deployed on Vercel.
