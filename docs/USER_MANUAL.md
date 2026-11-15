# 📖 EventGo User Manual

Welcome to **EventGo** — Kenya's online event ticketing and reservation platform. This manual provides step-by-step instructions for both customers and administrators.

**Live URLs**
- Customer site: https://eventgo-mauve.vercel.app
- Admin panel: https://eventgo-admin-weld.vercel.app/admin

---

## 👤 1. Customer Guide

### 1.1 Creating an Account
1. Navigate to the EventGo home page and click **Register**.
2. Enter your full name, email address, and Safaricom phone number (format: `2547XXXXXXXX`).
3. Create a secure password and click **Sign Up**.
4. You will be automatically logged in and redirected to the home page.

### 1.2 Logging In
1. Click **Login** in the navigation bar.
2. Enter your registered email and password.
3. Click **Login**. You will be redirected to the home page.

> If you enter the wrong credentials, an error message will be shown. Use **Forgot Password?** to reset your password.

### 1.3 Browsing Events
1. Click **Browse Events** in the navigation bar or use the search bar on the home page.
2. Use the filter panel to narrow results by:
   - **Search** — event title or keyword
   - **Category** — e.g. Music, Technology, Sports
   - **Date range** — From / To date pickers
   - **Price range** — minimum and maximum ticket price
3. Click **Show me events** to apply filters, or **Clear filters** to reset.
4. Click any event card to view full details.

### 1.4 Buying Tickets
1. On the event details page, choose your desired ticket type (e.g. Regular, VIP).
2. Use the **+** / **−** buttons to set the quantity (maximum 10 per type).
3. The total amount updates automatically.
4. Click **Continue to payment**.
5. If you are not logged in, you will be prompted to log in or register first.

> **Note:** If an event is cancelled, completed, or not yet published, the ticket purchase section will not be shown. A status notice will explain why.

### 1.5 Paying via M-Pesa
1. On the Payment page, review your order summary.
2. Enter your Safaricom phone number (format: `2547XXXXXXXX`).
3. Click **Pay via M-Pesa**.
4. An M-Pesa STK Push prompt will appear on your phone — enter your M-Pesa PIN to authorise.
5. Keep the page open. The system polls for confirmation automatically and redirects you once payment is verified.

> Payment confirmation may take up to 30 seconds. Do not close the page or refresh during this time.

### 1.6 Viewing Your Tickets
1. Click **My Tickets** in the navigation bar.
2. All purchased tickets are listed with their status (valid, used, cancelled).
3. Each ticket shows:
   - Event name, date, and venue
   - Ticket type and reference code (e.g. `TKT-A1B2C3`)
   - A QR code for scanning at the venue entrance

### 1.7 Managing Your Profile
1. Click your name in the top navigation bar, then select **My Profile**.
2. Your full name, phone number, email, and account type are displayed.
3. To edit your name or phone number:
   - Click **Edit Profile**.
   - Update the fields — the **Save changes** button is disabled until you make a change.
   - Click **Save changes**. A green confirmation message will appear.
4. Your email address cannot be changed.

### 1.8 Resetting Your Password
1. On the Login page, click **Forgot Password?**
2. Enter your registered email address and click **Submit**.
3. Check your inbox for a password reset link (valid for **15 minutes**).
4. Click the link, enter your new password, and submit.

### 1.9 Requesting Account Deletion
If you would like your account to be deleted:
1. Go to **My Profile**.
2. Click **Request Account Deletion** at the bottom of the page.
3. Read the confirmation message and click **Yes, submit request**.
4. An administrator will review and process the request. Your account will not be deleted immediately.

> Once a deletion request is submitted, the button is replaced with an amber notice confirming the request is pending.

### 1.10 Getting Help
- Click **Help** in the navigation bar for answers to frequently asked questions.
- Topics covered include: booking, M-Pesa payments, ticket retrieval, password reset, profile editing, and account deletion.

---

## 🛡️ 2. Administrator Guide

### 2.1 Admin Login (Two-Factor Authentication)
Admin access requires Two-Factor Authentication (2FA) for security.

1. Navigate to the Admin Panel login page.
2. Enter your administrator email and password.
3. A **6-digit One-Time Password (OTP)** will be sent to your email address.
4. Enter the OTP on the verification page and click **Verify**.
5. You will be redirected to the Admin Dashboard.

> OTPs expire after **5 minutes**. If yours expires, return to the login page and start again.
> 2FA applies to all elevated roles: **Admin**, **Supervisor**, and **Super Admin**.

### 2.2 Dashboard
The Dashboard gives a live overview of system health and activity:
- **Total Revenue** — sum of all successful M-Pesa payments
- **Tickets Sold** — total tickets issued
- **Total Events** — number of events on the platform
- **Recent Sales** — the 5 most recent paid orders
- **System Status** indicator (top bar) — shows whether the API server is reachable, updated every 30 seconds

### 2.3 Managing Events
Navigate to **Manage Events** in the sidebar.

**Creating an event:**
1. Fill in the event title, category, venue, and date/time.
2. Add one or more ticket types (name, price in KES, quantity available).
3. Click **Create event**. The event is published immediately.

**Editing an event:**
1. Find the event in the table and click **Edit**.
2. Update any field including the status (Draft, Published, Cancelled, Completed).
3. Click **Save changes**.

**Deleting an event:**
1. Click **Delete** next to the event.
2. Confirm in the dialog. Events with linked orders or payments cannot be deleted — cancel them instead.

**Filtering the events table:**
- Search by title, venue, or category
- Filter by status
- Filter by event date range

### 2.4 User Management
Navigate to **Users** in the sidebar.

The Users page shows all registered accounts with their role, status, registration date, and last login.

**Searching and filtering:**
- Use the search box to find users by name, email, or phone
- Filter by role (User, Admin, Supervisor, Super Admin)

**Editing a user:**
1. Click **Edit** next to any user.
2. Change their **role** or **account status** (Active / Disabled).
3. Click **Save changes** — the button is disabled until a change is made.

> Only a **Super Admin** can assign the Supervisor or Super Admin roles.

**Deletion requests:**
- If a user has requested account deletion, their row is highlighted in amber with a **"Deletion Requested"** badge.
- The **Deletion Requests** stat card shows the total count of pending requests.
- Click **Dismiss** to clear the flag after reviewing (disable the account first if appropriate).

### 2.5 Sales Reports
Navigate to **Reports** in the sidebar.

- View a breakdown of revenue and tickets sold per event.
- **Filter** by event name using the search box.
- **Sort** by revenue, tickets sold, or event name (ascending/descending).
- Click **Export PDF** to generate a printable branded report containing:
  - EventGo company name and branding
  - Report generation date and time
  - Summary totals (revenue, tickets, events)
  - Full event-by-event breakdown table

### 2.6 Security & Audit Logs
Navigate to **Security** in the sidebar.

The Security Centre displays up to 100 of the most recent system events, including logins, registrations, password resets, profile updates, payment activity, and admin actions.

**Filtering the audit log:**
- **Search** — by user name, email, action type, description, or IP address
- **Action category** — Auth, Password & 2FA, Payment, Profile & account, Admin actions, Failed/Cancelled, Other
- **Date range** — From / To date pickers
- **Clear filters** — resets all filters at once

The record count updates to show `X of Y Records` when filters are active.

### 2.7 Role Hierarchy

| Role | Access level |
|---|---|
| **User** | Customer-facing site only |
| **Admin** | Full admin panel access |
| **Supervisor** | Full admin panel access (assigned by Super Admin only) |
| **Super Admin** | Full access + can assign all roles including Supervisor and Super Admin |

---

## 🔒 3. Security Overview

| Feature | Implementation |
|---|---|
| Password storage | bcrypt hashing (salt rounds: 10) |
| SQL injection prevention | Sequelize ORM — all queries use parameterised statements |
| Two-Factor Authentication | Email OTP for all elevated roles, expires in 5 minutes |
| Session management | JWT tokens (24-hour expiry), invalidated on logout |
| Account protection | Disabled accounts cannot log in |
| Audit logging | Every significant action is recorded with user ID, IP address, and timestamp |

---

## 🗄️ 4. Database Overview

The EventGo database (`eventgo_db`) contains 9 tables:

| Table | Purpose |
|---|---|
| `users` | Registered accounts and roles |
| `categories` | Event categories (Music, Tech, etc.) |
| `events` | Event listings |
| `ticket_types` | Ticket tiers per event (Regular, VIP, etc.) |
| `orders` | Ticket purchase records |
| `payments` | M-Pesa payment transactions |
| `tickets` | Individual issued tickets with QR codes |
| `auth_tokens` | 2FA OTPs and password reset tokens |
| `audit_logs` | System activity trail |

---

*© 2026 EventGo Ticketing. All rights reserved.*
