# FarmWork Hub – Backend (Server)

This is the backend server for **FarmWork Hub**, built with **Node.js** and **Express**. It manages user authentication, job listings, profile updates, file uploads, and future payment integration.

## 📦 Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT & bcrypt (authentication)
- Cloudinary (file uploads)
- CORS / Helmet / Morgan

## 📁 Folder Structure

```
server/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── index.ts
│   └── app.ts
├── .env
├── tsconfig.json
└── package.json
```

## ⚙️ Setup Instructions

1. **Navigate to the server folder**

```bash
cd server
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/farmworkhub
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Run database migrations**

```bash
npx prisma migrate dev --name init
```

5. **Start the development server**

```bash
npm run dev
```

6. API runs at: `http://localhost:5000/api`

## 🧪 API Endpoints

```http
# User Routes
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/upload-avatar
GET    /api/users/:id/rating
POST   /api/users/:id/rate

# Job Routes
GET    /api/jobs
POST   /api/jobs
GET    /api/jobs/:id
...

# Auth Routes
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

## 🚀 Deployment

- Backend is deployable via **Railway**, **Render**, or **Heroku**
- Ensure `.env` is configured in the deployment dashboard

---

## 👩🏾‍💻 Developers

- [Daisy Mwambi](https://github.com/Shighi)
- [Ibrahim Tijani](https://github.com/teebabs521)
- [Sophie Olusola](https://github.com/Sophiewebstart)
