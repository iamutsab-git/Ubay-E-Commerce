import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: [/^\S+@\S+.\S+$/,"Please Enter a valid E-mail"],
        },
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: [3, "username must be at least 3 characters long"]
        },
        password:{
            type: String,
            required: true,
          minlength: [8,"password must be at least 8 characters long"]
        },
        avatar:{
            type: String,

        },
        isAdmin : {
            type : Boolean,
            default : false
        }
    //     role: {
    // type: String,
    // enum: ['user', 'admin'],
    // default: 'user'
//   }
    },
    {timestamps: true},
);

export default mongoose.model("User",UserSchema);

