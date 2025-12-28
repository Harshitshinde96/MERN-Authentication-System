# 🔐 MERN Authentication System

A **production-ready authentication system** built using the **MERN stack**, designed with **real-world security practices** and scalability in mind.

This is **not** a demo or tutorial project. It implements authentication the way it is expected to be done in **industry-grade applications**.

---

## 🛠️ Tech Stack

### 🧩 Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### 🎨 Frontend

- React.js
- Axios

### 🔐 Authentication & Security

- JSON Web Tokens (JWT)
- HTTP-only Cookies
- Cookie Parser
- Password Hashing (bcrypt)

### 📧 Email & Verification

- Nodemailer
- Email-based verification and notifications

---

## ✨ Key Features

- ✅ Secure user registration and login
- 🔑 JWT-based authentication
- 🍪 HTTP-only cookie-based session handling
- 🔒 Password hashing and verification
- 🛡️ Protected routes (backend and frontend)
- 📩 Email verification using Nodemailer
- ⏳ Token expiration and validation
- 🧱 Clean architecture (routes, controllers, services)

---

## 🔄 Authentication Flow (High Level)

1. 👤 User registers with email and password
2. 🔐 Password is hashed before storing in the database
3. 🎟️ JWT is generated after successful authentication
4. 🍪 JWT is stored securely in an HTTP-only cookie
5. 🛡️ Protected routes validate JWT on every request
6. 📧 Email verification is handled using Nodemailer

---

## 📁 Project Structure (Simplified)

```
root
├── client        # React frontend
├── server        # Node.js backend
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middleware
│   ├── utils
│   └── config
├── .env
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `server` directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

---

## 🚀 Setup and Run (Local Development)

### 1️⃣ Clone the Repository

```
git clone <repository-url>
cd <project-folder>
```

---

### 2️⃣ Backend Setup

```
cd server
npm install
npm run server
```

📡 Backend will run at:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```
cd client
npm install
npm start
```

🌐 Frontend will run at:

```
http://localhost:3000
```

---

## 🔐 Security Notes

- 🛑 JWTs are stored in HTTP-only cookies to mitigate XSS attacks
- 🔑 Sensitive credentials are managed using environment variables
- 🔒 Passwords are never stored in plain text
- 🛡️ Authentication middleware protects all secured routes

---

## ⚠️ Important Notes

- 📌 Basic understanding of the MERN stack is assumed
- 🚫 Do not commit `.env` files
- 🔐 Use strong secrets and credentials in production

---

## 🏁 Conclusion

This project demonstrates a **complete, production-oriented MERN authentication system** following industry-standard security practices.

It can be extended further with:

- 🔄 Refresh Tokens
- 🧑‍💼 Role-Based Access Control (RBAC)
- 🔗 OAuth integrations (Google, GitHub, etc.)
