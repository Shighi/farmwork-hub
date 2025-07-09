# FarmWork Hub

FarmWork Hub is a modern web application connecting agricultural employers with job seekers across Africa. It provides a platform for farmers, agribusinesses, and agricultural organizations to post job listings, while enabling youth and rural workers to find agricultural employment opportunities easily.

## 🌐 Live Demo

Coming soon...

---

## 🚀 Tech Stack

### Frontend

* React 18
* TypeScript
* Tailwind CSS
* Vercel (deployment)

### Backend

* Node.js
* Express
* PostgreSQL
* Prisma ORM
* JWT Authentication (with bcrypt)
* Cloudinary (image uploads)
* Railway or Heroku (deployment)

### Future Integration

* Flutterwave API for payment processing

---

## 📂 Project Structure

```
FarmWorkHub/
├── client/               # React frontend
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── server/               # Express backend
│   ├── prisma/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── README.md             # Root project README (this file)
└── .gitignore
```

---

## 🔐 Environment Variables

### For client (`client/.env`)

```
VITE_API_BASE_URL=http://localhost:5000/api
```

### For server (`server/.env`)

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/farmwork-hub.git
cd farmwork-hub
```

### 2. Install Dependencies

```bash
# Install backend
cd server
npm install

# Install frontend
cd ../client
npm install
```

### 3. Set Up Environment Files

Create `.env` files in both `client/` and `server/` directories using the examples above.

### 4. Database Setup

```bash
cd server
npx prisma migrate dev --name init
```

### 5. Run the App

```bash
# Start backend
cd server
npm run dev

# Start frontend (in a new terminal)
cd client
npm run dev
```

---


## 👩‍💻 Developers

* [Daisy Mwambi](https://github.com/Shighi)
* [Ibrahim Tijani](https://github.com/teebabs521)
* [Sophie Olusola](https://github.com/Sophiewebstart)

---

