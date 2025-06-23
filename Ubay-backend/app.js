import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";
import AuthRoutes from "./Routes/AuthRoutes.js"
import cookieParser from "cookie-parser";
dotenv.config();


const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


app.use("/api/auth",AuthRoutes);


mongoose.connect(process.env.MONGODB_URL).then(()=>{
    app.listen(process.env.PORT,
    console.log("connected to DB & running on",process.env.PORT))
}).catch(error=>
    console.error(error)
)
