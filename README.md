# 🎟️ EventGo - Event Ticketing & Reservation System

## 👥 The Team

*   **Ashley Otsiula** - Backend API, Database Architecture, Integrations
*   **Ivy Tirop** - User Frontend & UI/UX
*   **Rayan Abdi** - Admin Dashboard, Reporting, Frontend Integration

---

EventGo is a full-stack web application designed to modernize the event ticketing experience in Kenya. It allows users to discover events, purchase tickets seamlessly using M-Pesa, and receive secure QR-coded digital tickets. Event organizers and administrators are equipped with a powerful, secure dashboard to manage events, monitor sales, and generate reports.

## 🌍 Live Deployment

*   **Backend API:** [https://eventgo-api.onrender.com](https://eventgo-api.onrender.com)
*   **Database:** Hosted on Aiven Cloud (MySQL)
*   **Frontend:** *Coming soon (Vercel/Netlify)*

## ✨ Key Features

### Customer Experience

*   **Event Discovery:** Browse and search for events by category, date, or venue.
*   **Seamless Checkout:** Purchase tickets directly using the M-Pesa STK Push API (Safaricom Daraja).
*   **Digital Tickets:** Instantly receive a unique QR-coded digital ticket for event entry.
*   **User Dashboard:** View ticket history and manage account settings.
*   **Secure Accounts:** Includes email-based password reset flows.

### Administrator Experience

*   **Secure Login:** Protected by Email-based Two-Factor Authentication (2FA).
*   **Event Management:** Create, update, and publish events with specific ticket types (e.g., Regular, VIP) and inventory limits.
*   **Real-time Analytics:** Access a dashboard showing total revenue, tickets sold, and recent transactions.
*   **Reporting:** Generate detailed sales reports per event.
*   **Audit Logging:** Track all critical system actions (logins, payments, admin changes) for security compliance.

## 🛠️ Technology Stack

*   **Frontend:** React.js (Vite), CSS/Bootstrap *(To be deployed)*
*   **Backend:** Node.js, Express.js
*   **Database:** MySQL, Sequelize ORM (Hosted on Aiven)
*   **Authentication:** JWT (JSON Web Tokens), bcrypt password hashing
*   **Integrations:** Safaricom Daraja API (M-Pesa), Resend API (Emails/OTP)

---

## 💻 Local Setup Instructions

### Prerequisites

Make sure you have the following installed:

*   [Node.js](https://nodejs.org/) (v20 or higher)
*   [MySQL Server](https://dev.mysql.com/downloads/installer/) (v8.0.16 or higher)
*   [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/natasherr/eventgo.git
cd eventgo
```

### 2. Backend Setup

Navigate into the server directory and install dependencies:

```bash
cd server
npm install
```

Create your local `.env` file by copying the example:

```bash
cp .env.example .env
```

Open the `.env` file and fill in your credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=eventgo_db
DB_PORT=3306
JWT_SECRET=your_super_secret_key

# M-Pesa Daraja Sandbox Credentials
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://your-ngrok-url.ngrok-free.dev/api/payments/callback

# Resend Email Credentials
RESEND_API_KEY=your_resend_api_key
FRONTEND_URL=http://localhost:5173
```

Create your local database:

```sql
CREATE DATABASE eventgo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Seed it with sample data:

```bash
node src/seed.js
node src/seedMoreData.js
node src/seedSales.js
```

Start the development server:

```bash
npm run dev
```

*(The backend will run on http://localhost:5000)*

### 3. Frontend Setup

Open a new terminal window and navigate to the client directory:

```bash
cd client
npm install
npm run dev
```

*(The frontend will run on http://localhost:5173)*

---



## 📖 Documentation

*   **User Manual** - Instructions on how to use the system as a customer and admin.
*   **Database Schema** - The raw SQL schema for the database.
