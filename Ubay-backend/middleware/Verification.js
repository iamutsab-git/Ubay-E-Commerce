import jwt from "jsonwebtoken"
import User from "../Models/UserModel.js"

export const verifyToken = async(req,res,next) => {
    const token = req.cookies.token;

    if( !token) return res.status(401).json({ msg: "Not Authenticated"});
     
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload)=>{
        if(err) return res.status(403).json({msg : "Token invalid"});

        req.userId = payload.id;

        next()
    });
};
export const verifyUser = async(req,res,next)=> {
    verifyToken(req,res,()=>{
         if(req.userId===req.params.id){
        next()
    }else{
        return res.status(403).json({msg: "Not Authenticated"});
    }

    });
   
};

export const isAdmin = async (req, res, next) => {
  try {
    // 1. Get user from database using the ID attached by verifyToken
    const user = await User.findById(req.userId);
    
    // 2. Check if user exists and is an admin
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: "Admin access required" 
      });
    }

    // 3. Attach full user object to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error during admin verification" 
    });
  }
};