import User from "../Models/UserModel.js";
import bcrypt from "bcrypt";


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
    try {
        const { email, username, avatar, password } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (email) user.email = email;
        if (username) user.username = username;
       // Handle avatar upload (assuming you're using your upload middleware)
        if (req.file) {
            // If using Cloudinary (recommended instead of local uploads)
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'user-avatars',
                width: 150,
                height: 150,
                crop: 'fill'
            });
            user.avatar = {
                url: result.secure_url,
                public_id: result.public_id
            };
            
            // If previous avatar exists and was Cloudinary upload, delete old file
            if (user.avatar?.public_id) {
                await cloudinary.uploader.destroy(user.avatar.public_id);
            }
        }
       if (password && password.trim() !== "") {
    user.password = await bcrypt.hash(password, 10);
};

        await user.save();
        res.json({ message: 'Profile updated successfully',
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
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