import { User } from "../Models/user.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import sharp from "sharp";
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// CLOUDINARY
cloudinary.config({ 
    cloud_name: 'dtebgdkhj', 
    api_key: '499679219946323', 
    api_secret: 'JBsDafK_f_xhy0tgSEa7iGrngQE'
});

export const Register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const verifyRegister = await User.findOne({ email });
        if (verifyRegister) {
            return res.status(400).json({ message: "User Already Exists" });
        }

        let profileImgUrl = ''; // Initialize empty profile image URL

        // If a profile image is uploaded
        if (req.file) {
            try {
                const inputFilePath = req.file.path;
                const outputFilePath = path.join(path.dirname(inputFilePath), `${uuidv4()}.jpg`);

                // Resize and compress the image using Sharp
                await sharp(inputFilePath)
                    .resize(800) // Resize image to 800px width
                    .jpeg({ quality: 10 }) // Compress image quality
                    .toFile(outputFilePath)
                    .catch((err) => {
                        console.error("Sharp Error: ", err);
                        throw new Error("Sharp Processing Failed");
                    });

                // Upload the processed image to Cloudinary
                const Cloudinaryres = await cloudinary.uploader.upload(outputFilePath, {
                    transformation: [{ quality: 'auto:low' }]
                });

                // Set the profile image URL from Cloudinary response
                profileImgUrl = Cloudinaryres.secure_url;

                // Delete local files after upload
                deleteFile(inputFilePath);
                deleteFile(outputFilePath);
            } catch (fileError) {
                console.error('Error processing or uploading file:', fileError);
                return res.status(500).json({ message: "File Processing Error" });
            }
        }

        // Save the user data (with or without profile image)
        const newData = new User({
            name,
            email,
            password, // Storing password directly, since no hashing is required
            profileImg: profileImgUrl // Empty if no image uploaded
        });

        await newData.save();

        return res.status(201).json({ message: "User registered successfully", user: newData });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Helper function to delete files
const deleteFile = (filePath) => {
    setTimeout(() => {
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
                console.error('Error deleting file:', unlinkErr);
            } else {
                console.log(`Successfully deleted file: ${filePath}`);
            }
        });
    }, 2000);
};
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const verifyEmail = await User.findOne({ email });
        if (!verifyEmail) {
            return res.json({ message: "User Doesn't Exist, Please Register" });
        }
        if (verifyEmail.password === password) {
            return res.status(200).json({ message: "Login Successful", user: verifyEmail });
        }
        res.status(400).json({ message: "Incorrect Password" });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: "Server Error" });
    }
}
export const changeProfileImage = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user already has a profile picture in Cloudinary
        if (user.profileImg) {
            try {
                // Extract the public ID from the Cloudinary URL
                const publicId = user.profileImg.split('/').pop().split('.')[0];

                // Delete the existing profile image from Cloudinary
                await cloudinary.uploader.destroy(publicId, (error, result) => {
                    if (error) {
                        console.error('Error deleting image from Cloudinary:', error);
                        return res.status(500).json({ message: 'Error deleting image from Cloudinary' });
                    }
                    console.log('Cloudinary delete result:', result);
                });
            } catch (deleteError) {
                console.error('Error deleting existing profile image from Cloudinary:', deleteError);
                return res.status(500).json({ message: 'Error deleting existing image from Cloudinary' });
            }
        }

        if (req.file) {
            try {
                // Process the uploaded image using sharp
                const inputFilePath = req.file.path;
                const outputFilePath = path.join(path.dirname(inputFilePath), `${uuidv4()}.jpg`);
                await sharp(inputFilePath)
                    .resize(800)
                    .jpeg({ quality: 10 }) 
                    .toFile(outputFilePath);

                // Upload new image to Cloudinary
                const cloudinaryRes = await cloudinary.uploader.upload(outputFilePath, {
                    transformation: [{ quality: 'auto:low' }]
                });

                // Delete local copies of images
                const deleteFile = (filePath) => {
                    setTimeout(() => {
                        fs.unlink(filePath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error('Error deleting file:', unlinkErr);
                            } else {
                                console.log(`Successfully deleted file: ${filePath}`);
                            }
                        });
                    }, 2000);
                };

                deleteFile(inputFilePath);
                deleteFile(outputFilePath);

                // Update the user's profile image in the database
                user.profileImg = cloudinaryRes.secure_url;
                await user.save();

                return res.status(200).json({ message: "Profile image updated successfully", user });
            } catch (fileError) {
                console.error('Error processing or uploading file:', fileError);
                return res.status(500).json({ message: "File Processing Error" });
            }
        } else {
            return res.status(400).json({ message: "No file uploaded" });
        }
    } catch (error) {
        console.error('Error during profile image update:', error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const wake = async(req,res)=>{
    res.json({message:"Server WokeUp"})
}