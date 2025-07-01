import dotenv from "dotenv"
dotenv.config();
import express from "express"
import mongoose from "mongoose";
import AuthRoutes from "./Routes/AuthRoutes.js"
import ProductRoutes from "./Routes/ProductRoutes.js"
import UserRoutes from "./Routes/UserRoutes.js"
import OrderRoutes from "./Routes/OrderRoutes.js"
import cookieParser from "cookie-parser";
import cors from "cors";




const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use("/api/auth",AuthRoutes);
app.use("/api/user",UserRoutes);
app.use("/api/product",ProductRoutes);
app.use("/api/order",OrderRoutes);



mongoose.connect(process.env.MONGODB_URL).then(()=>{
    app.listen(process.env.PORT,
    console.log("connected to DB & running on",process.env.PORT))
}).catch(error=>
    console.error(error)
)
