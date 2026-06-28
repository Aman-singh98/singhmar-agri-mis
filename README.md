# 🌾 Singhmar Agri MIS

> A full-stack **Management Information System** for Agarwal Agricultural — featuring role-based access for Superadmin, Admin & Employee with user management, mini dispatch, drip dispatch, and auto reports.

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Redux Toolkit
- React Router v7
- Tailwind CSS
- React Toastify

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt.js
- Cloudinary (file/image uploads)

---

## 📁 Project Structure

```
Agarwal_MIS_Software/
├── client/                  # React frontend
│   └── src/
│       ├── routes/          # React Router config
│       ├── context/         # Auth context
│       ├── store/           # Redux slices
│       ├── constants/       # Route constants
│       └── pages/
│           ├── LoginPage.jsx
│           └── UserManage/
│               ├── UserManage.jsx
│               ├── CreateUser.jsx
│               └── ManageUsers.jsx
│
└── server/                  # Express backend
    ├── config/
    │   └── db.js            # MongoDB connection
    ├── models/
    │   └── User.js          # Mongoose user model
    ├── seeds/
    │   └── userSeed.js      # Superadmin seed script
    └── .env                 # Environment variables (never commit)
```

---

## 👥 Roles

| Role | Access |
|---|---|
| `superadmin` | Full access — manage admins & employees |
| `admin` | Manage employees and operations |
| `employee` | Access assigned tasks and reports |

---

## ⚙️ Environment Variables

Create a `.env` file inside the `server/` directory with the following keys:

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

> ⚠️ **Never commit your `.env` file.** Make sure `.env` is listed in your `.gitignore`.

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

Create your `.env` file inside `server/` using the template above.

```bash
# Seed the superadmin account
npm run seed

# Start the server
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

The seed script creates the initial **Superadmin** account using credentials from your `.env` file. It is safe to run multiple times — it skips creation if the account already exists.

```bash
# Run from the server/ directory
npm run seed
```

Make sure your `package.json` in `server/` has:

```json
"scripts": {
  "seed": "node seeds/userSeed.js"
}
```

---

## 🔐 .gitignore

Make sure your `.gitignore` includes:

```
# Environment variables
.env

# Dependencies
node_modules/

# Build output
dist/
build/
```

---

## 📄 License

This project is private and proprietary to **Singhmar Agri**.
