# 🛒 Ubay Project

**Ubay** is a full-stack web application built with a modern frontend and backend architecture. The frontend is developed using **React** and **Vite**, providing a fast and interactive user interface, while the backend is powered by **Node.js** with **Express**, handling API requests, user authentication, and business logic.

This project is structured as a **monorepo**, with `Ubay-frontend` and `Ubay-backend` as subdirectories, managed under a single Git repository.

---

## 🧰 Tech Stack

### Frontend (`Ubay-frontend`)
- **React** – JavaScript library for building user interfaces
- **Vite** – Next-generation frontend tooling for fast development and builds
- **Tailwind CSS** – Utility-first CSS framework for styling
- **ESLint** – Code linting for consistent code quality
- **npm** – Package manager for dependencies

### Backend (`Ubay-backend`)
- **Node.js** – JavaScript runtime for server-side logic
- **Express.js** – Minimalist web framework for building APIs
- **MongoDB** – NoSQL database for data storage
- **Mongoose** – ODM for MongoDB
- **JWT** – Secure user authentication
- **npm** – Package manager for backend dependencies

---

## ✅ Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) – Version 18 or higher
- npm – Comes with Node.js (`npm -v` to check)
- [Git](https://git-scm.com/) – For cloning the repository
- [MongoDB](https://www.mongodb.com/) – Local instance or MongoDB Atlas

---

## ⚙️ Setup and Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Ubay-project
```

### 2. Install Frontend Dependencies
```bash
cd Ubay-frontend
npm install
```

### 3. Install Backend Dependencies
```bash
cd ../Ubay-backend
npm install
```

---

## 🔐 Configure Environment Variables

### 🔸 Frontend (`Ubay-frontend`)
Create a `.env` file inside `Ubay-frontend/`:

```
VITE_API_URL=http://localhost:3000/api
```

### 🔸 Backend (`Ubay-backend`)
Create a `.env` file inside `Ubay-backend/`:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/ubay
JWT_SECRET=your_jwt_secret
```

> 🔒 **Never commit your `.env` files** to version control!

---

## 🚀 Running the Project

### Start the Frontend
```bash
cd Ubay-frontend
npm run dev
```
This will start the development server at:  
📍 `http://localhost:5173` (default Vite port)

> Use `npm run build` to create a production-ready build.

### Start the Backend
```bash
cd ../Ubay-backend
npm start
```
This will start the API server at:  
📍 `http://localhost:3000` (or your configured port)

---

## 🗂️ Project Structure

```
Ubay-project/
├── .gitignore              # Shared ignores for the monorepo
├── .gitattributes          # Line ending normalization
├── Ubay-frontend/          # Frontend code (React + Vite)
│   ├── .gitignore
│   ├── src/                # React components and assets
│   ├── vite.config.js      # Vite configuration
│   ├── package.json        # Frontend dependencies
│   └── ...
├── Ubay-backend/           # Backend code (Node.js + Express)
│   ├── .gitignore
│   ├── server.js           # Server entry point
│   ├── package.json        # Backend dependencies
│   └── ...
├── README.md               # Project documentation
```

### File Notes:
- **`.gitignore`** files are scoped to their directories:
  - `Ubay-frontend/`: ignores `node_modules`, `dist`, etc.
  - `Ubay-backend/`: ignores `node_modules`, `.env`, etc.
- **`.gitattributes`** ensures consistent LF line endings across systems.

---

## 🤝 Contributing

We welcome contributions from everyone! To contribute:

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request

Please follow ESLint rules in the frontend and ensure any added logic is well tested.

---

## 📄 License

**MIT License**  
You are free to use, modify, and distribute this project.

---

## ❓ Support & Issues

If you encounter any issues, feel free to:
- Open an [Issue](https://github.com/yourusername/Ubay-project/issues)
- Contact the maintainers

---

## 🙌 Acknowledgments

Thanks to all the open-source tools, libraries, and contributors that make projects like this possible.

---
