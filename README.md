# 🛒 Ubay - E-Commerce Platform

Ubay is a full-stack e-commerce web application designed to provide a seamless online shopping experience. Built with a modern tech stack, it features a responsive frontend and a robust backend, enabling users to browse products, manage carts, and process secure transactions. The project is organized as a monorepo, with separate directories for the frontend and backend.

---

## ✨ Features

- **Product Browsing**: Explore a wide range of products with filtering and search capabilities.
- **Shopping Cart**: Add, remove, and update items in the cart with real-time updates.
- **User Authentication**: Secure sign-up, login, and logout using JWT-based authentication.
- **Order Management**: Place orders and view order history.
- **Image Management**: Upload and manage product images via Cloudinary.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **RESTful API**: Scalable backend APIs for seamless frontend-backend communication.

---

## 🧰 Tech Stack

### Frontend (`Ubay-frontend`)
- **React**: JavaScript library for building dynamic user interfaces.
- **Vite**: Lightning-fast frontend tooling for development and builds.
- **Tailwind CSS**: Utility-first CSS framework for modern, responsive styling.
- **ESLint**: Ensures consistent code quality and adherence to standards.
- **npm**: Dependency management.

### Backend (`Ubay-backend`)
- **Node.js**: JavaScript runtime for server-side logic.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for flexible data storage.
- **Mongoose**: ODM for MongoDB to simplify database operations.
- **JWT**: Secure user authentication and authorization.
- **Cloudinary**: Cloud-based image upload, storage, and optimization.
- **npm**: Dependency management.

---

## ✅ Prerequisites

To run this project locally, ensure you have the following installed:

- **Node.js**: Version 18 or higher.
- **npm**: Included with Node.js (verify with `npm -v`).
- **Git**: For cloning the repository.
- **MongoDB**: Local instance or a MongoDB Atlas account.
- **Cloudinary Account**: For image management (sign up at [cloudinary.com](https://cloudinary.com)).

---

## ⚙️ Setup and Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/iamutsab-git/Ubay-E-Commerce.git
   cd Ubay-E-Commerce
   
2. **Install Frontend Dependencies  
   ```bash
   cd Ubay-frontend
   npm install
  

3. **Install Backend Dependencies  
    ```bash
    cd ../Ubay-backend
    npm install 

## Configure Environment Variables  
### Frontend (Ubay-frontend)  
##### Create a .env file in the Ubay-frontend/ directory:  
- VITE_API_URL=http://localhost:3000/api  

## Backend (Ubay-backend)  
#### Create a .env file in the Ubay-backend/ directory:  
- PORT=3000  
- MONGO_URI=mongodb://localhost:27017/ubay  
- JWT_SECRET=your_jwt_secret  
- CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name  
- CLOUDINARY_API_KEY=your_cloudinary_api_key  
- CLOUDINARY_API_SECRET=your_cloudinary_api_secret  

Note: Never commit .env files to version control. Ensure they are added to .gitignore.  

## 🚀 Running the Project  
#### Start the Frontend  
- -cd Ubay-frontend  
- -npm run dev  

The frontend will be available at http://localhost:5173 (default Vite port). For a production build, run npm run build.  
** Start the Backend  
   -  cd ../Ubay-backend  
   -  npm start

   -  The backend API will be available at http://localhost:3000 (or your configured port).  

## 🗂️ Project Structure  
Ubay-E-Commerce/  
├── .gitignore              # Shared ignores for the monorepo  
├── .gitattributes          # Ensures consistent line endings  
├── Ubay-frontend/          # Frontend code (React + Vite)  
│   ├── .gitignore          # Frontend-specific ignores  
│   ├── src/                # React components, assets, and logic  
│   ├── vite.config.js      # Vite configuration  
│   ├── package.json        # Frontend dependencies  
│   └── ...  
├── Ubay-backend/           # Backend code (Node.js + Express)  
│   ├── .gitignore          # Backend-specific ignores  
│   ├── server.js           # Server entry point  
│   ├── package.json        # Backend dependencies  
│   └── ...  
├── README.md               # Project documentation  

##🤝 Contributing  
Contributions are welcome! To contribute. 
-
Built with 💻 and ☕ by iamutsab-git.
