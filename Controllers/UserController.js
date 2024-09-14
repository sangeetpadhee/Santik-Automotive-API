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

        const verifyRegister = await User.findOne({ email });
        if (verifyRegister) {
            return res.status(400).json({ message: "User Already Exists" });
        }

        if (req.file) {
            try {
                const inputFilePath = req.file.path;
                const outputFilePath = path.join(path.dirname(inputFilePath), `${uuidv4()}.jpg`);
                await sharp(inputFilePath)
                    .resize(800)
                    .jpeg({ quality: 10 }) 
                    .toFile(outputFilePath);

                const Cloudinaryres = await cloudinary.uploader.upload(outputFilePath, {
                    transformation: [{ quality: 'auto:low' }]
                });

                 // DELETE STORED PICS
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

                const newData = new User({ name, email, password, profileImg: Cloudinaryres.secure_url });
                await newData.save();

                return res.status(201).json({ message: "User registered successfully", user: newData });
            } catch (fileError) {
                console.error('Error processing or uploading file:', fileError);
                return res.status(500).json({ message: "File Processing Error" });
            }
        } else {
            return res.status(400).json({ message: "No file uploaded" });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: "Server Error" });
    }
}
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
