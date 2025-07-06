import User from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import { cloudinary } from "../Config/cloudinary.js";

export const getALLUser = async(req, res) => {
    try{
        const users = await User.find();
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Error while fetching",
            error: error.message,
        });

    }
};
export const getUser = async (req, res) => {
  try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;
    
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update basic fields
        if (username) user.username = username;
        if (email) user.email = email;
        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        // Handle avatar update if new file is uploaded
        if (req.file) {
            // Delete old avatar from Cloudinary if exists
            if (user.avatar?.public_id) {
                await cloudinary.uploader.destroy(user.avatar.public_id);
            }

            // Upload new avatar
            
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "mern_uploads",
               
            });

            // Update avatar object
            user.avatar={
                url: result.secure_url,
                public_id: result.public_id
            };

           
        }

        await user.save();
        
        // Remove sensitive data before sending response
        const { password, ...userData } = user.toObject();
        
        return res.status(200).json({ 
            message: "Profile updated successfully", 
            user: userData 
        });
        
    } catch (error) {
    console.error("Update error:", error.message);
    console.error(error.stack);
    return res.status(500).json({
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
}

};


export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};