import dotenv from "dotenv"
dotenv.config();
import express from "express"
import mongoose from "mongoose";
import AuthRoutes from "./Routes/AuthRoutes.js"
import ProductRoutes from "./Routes/ProductRoutes.js"
import UserRoutes from "./Routes/UserRoutes.js"
import OrderRoutes from "./Routes/OrderRoutes.js"
import CartRoutes from "./Routes/CartRoutes.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";




const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    collectionName: "sessions",
    ttl: 14 * 24 * 60 * 60 // 14 days in seconds
  }),
  cookie: {
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days in ms
    httpOnly: true,
    sameSite: "lax",
    secure: false // Set to true if using HTTPS
  }
}));
app.use("/api/auth",AuthRoutes);
app.use("/api/user",UserRoutes);
app.use("/api/product",ProductRoutes);
app.use("/api/order",OrderRoutes);
app.use("/api/cart",CartRoutes);




mongoose.connect(process.env.MONGODB_URL).then(()=>{
    app.listen(process.env.PORT,
    console.log("connected to DB & running on",process.env.PORT))
}).catch(error=>
    console.error(error)
)
