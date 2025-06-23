import User from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const register = async(req, res)=>{
     const {username, email, password, avatar} = req.body;
    try{
    const existingUser = await User.findOne({email})
    if(existingUser){
        return res.status(400).json({message: `$(existingUser.username) already exist`});
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
        email,
        password: hashedPassword,
        username,
        avatar 
    });
    return res.status(200).json({message:"User Registered Successfully",
        data: newUser
    });
 }catch(error){
        res.status(500).json({message: "Internal Server Error"});
        console.error(error);
 }};

 export const login = async(req, res)=>{
    const{username, password} = req.body;

    try{
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({message: " Inavlid Credentials"});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({message: " Invalid Credentials"});
        }

        const period = 1000 * 60 * 60 *24 * 15 //15 days

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                avatar: user.avatar,
                isAdmin: false
            },
            process.env.JWT_SECRET_KEY,
            {expiresIn: period}
        );
        const{ password:pw, ...userInfo} = user.toObject();

        res
        .cookie("token", token, {
            httpOnly: true, //secure true
            maxAge: period,
        })
        .status(200)
        .json({
        message: 'Login Successful',
        data: userInfo,
      });
    }catch(error){
        res.status(500).json({message: "Internal server error"});
        console.error(error)
    }
 };

export  const logout = (req, res)=>{
    res.clearCookie("token").status(200).json({message:"User  logged out"});
 };

 

 