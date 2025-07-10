# FarmWork Hub – Frontend (Client)

This is the frontend application of **FarmWork Hub**, a platform that connects agricultural employers with job seekers across Africa. Built with **React 18** and **TypeScript**, it offers a clean user interface, secure authentication, and intuitive user experience for workers and employers.

## 📦 Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- HTML5 / CSS3
- Vite (or Create React App, if used)
- jsPDF + html2canvas (for resume download)
- Axios (for API requests)

## 📁 Folder Structure

```
client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## 🛠️ Setup Instructions

1. **Navigate to the client folder**

```bash
cd client
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. Open in browser: `http://localhost:5173/`

## 🌐 Environment Variables

Create a `.env` file in the `client/` folder with the following:

```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

> Replace the values with your actual API URL and Cloudinary credentials.

## 🚀 Deployment

- Frontend is deployed on **Vercel**
- Auto-deploy via GitHub integration

---

## 👩🏾‍💻 Developers

- [Daisy Mwambi](https://github.com/Shighi)
- [Ibrahim Tijani](https://github.com/teebabs521)
- [Sophie Olusola](https://github.com/Sophiewebstart)
