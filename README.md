<div align="center">

# 🌾 Singhmar Agri MIS

### Agricultural Management Information System

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-neershakti.cloud-22c55e?style=for-the-badge)](https://neershakti.cloud/login)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

> A full-stack MIS portal built for Singhmar Agri — powering role-based access, user management, dispatch operations, and automated reporting under one roof.

**[🚀 View Live →](https://neershakti.cloud/login)**

</div>

---

## ✨ Features

- 🔐 **Role-Based Authentication** — Superadmin, Admin & Employee with JWT-secured login
- 👥 **User Management** — Create, edit, delete & reset passwords for admins and employees
- 📦 **Mini Dispatch & Drip Dispatch** — Streamlined agricultural dispatch workflows
- 📊 **Auto Reports** — Automated reporting for operations and records
- ☁️ **Cloud Storage** — Cloudinary integration for file and image uploads
- 📱 **Fully Responsive** — Mobile-first design, works on all screen sizes
- 🔔 **Toast Notifications** — Real-time feedback on every action

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Redux Toolkit, React Router v7 |
| Styling | Tailwind CSS, Custom Animations |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, Bcrypt.js |
| Storage | Cloudinary |
| Notifications | React Toastify |

---

## 👥 Roles & Access

| Role | Capabilities |
|---|---|
| 🛡️ `superadmin` | Full access — manage admins, employees & all operations |
| 👔 `admin` | Manage employees, handle dispatch & reports |
| 👷 `employee` | Access assigned tasks and view reports |

---

## 📁 Project Structure

```
singhmar-agri-mis/
├── client/                     # React frontend (Vite)
│   └── src/
│       ├── routes/             # React Router config
│       ├── context/            # Auth context
│       ├── store/              # Redux slices
│       ├── constants/          # Route constants
│       └── pages/
│           ├── LoginPage.jsx
│           └── UserManage/
│               ├── UserManage.jsx
│               ├── CreateUser.jsx
│               └── ManageUsers.jsx
│
└── server/                     # Express backend
    ├── config/
    │   └── db.js               # MongoDB connection
    ├── models/
    │   └── User.js             # Mongoose user model
    ├── seeds/
    │   └── userSeed.js         # Superadmin seed script
    └── .env                    # Environment variables (never commit)
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `server/` directory:

```env
# ── Server ────────────────────────────────────────────
PORT=5000

# ── MongoDB ───────────────────────────────────────────
MONGO_URI=your_mongodb_connection_string

# ── JWT ───────────────────────────────────────────────
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=1d

# ── Superadmin Seed ───────────────────────────────────
SUPER_ADMIN_NAME=Super Admin
SUPER_ADMIN_EMAIL=superadmin@yourdomain.com
SUPER_ADMIN_PASSWORD=your_strong_password_here

# ── Cloudinary ────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> ⚠️ **Never commit your `.env` file.** Ensure `.env` is in your `.gitignore`.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Aman-singh98/singhmar-agri-mis.git
cd singhmar-agri-mis
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Add your `.env` file using the template above, then:

```bash
# Seed the superadmin account
npm run seed

# Start the dev server
npm run dev
```

### 3. Setup the Frontend

```bash
cd ../client
npm install
npm run dev
```

---

## 🌱 Seed Script

Creates the initial **Superadmin** account from your `.env` credentials.
Safe to run multiple times — skips if the account already exists.

```bash
# Run from server/ directory
npm run seed
```

Ensure `server/package.json` has:

```json
"scripts": {
  "seed": "node seeds/userSeed.js"
}
```

---

## 🔒 .gitignore

```gitignore
# Environment variables — never commit
.env

# Dependencies
node_modules/

# Build output
dist/
build/
```

---

## 🌐 Live Demo

Try it out live at **[neershakti.cloud/login](https://neershakti.cloud/login)**

---

<div align="center">

Made with ❤️ for **Singhmar Agri**

</div>
