import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import { GoogleGenerativeAI} from '@google/generative-ai';
import multer from 'multer';
import cloudinary from 'cloudinary';

import User from './models/User.mjs'; 
import Photo from './models/Photo.mjs';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// const url = cloudinary.url('cld-sample-5', {
//     transformation: [
//         {
//             quality: 'auto',
//         },
//         {
//             fetch_format: 'auto',
//         }
//     ]
// });
// console.log(url);

// (async function() {
//     const results = await cloudinary.uploader.upload('../client/public/team_work.jpg');
//     console.log(results);
//     const url = cloudinary.url(results.public_id, {
//         transformation: [
//             {
//                 quality: 'auto',
//                 fetch_format: 'auto'
//             },
//             {
//                 width: 300,
//                 height: 300,
//                 crop: 'fill',
//                 gravity: 'auto'
//             }
//         ]
//     });
//     console.log(url);
// })();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

const storage = multer.memoryStorage(); // Store files in memory (for Cloudinary streaming)
const upload = multer({ storage: storage }); // Initialize multer with memory storage

app.post('/main-page', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: 'Error uploading to Cloudinary', error });
          }
  
          // Return the image URL to the client
          res.json({
            imageUrl: result.secure_url
          });
        }
      );
      
      // Pipe the file buffer to Cloudinary's upload stream
      result.end(req.file.buffer);
    } catch (error) {
      console.error('Error handling file upload:', error);
      res.status(500).json({ message: 'Error processing the file', error });
    }
  });

// Registration route
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create a new user
        const user = new User({
            name,
            email,
            password
        });

        // Save the user to the database
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login route
app.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check if the password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Return success message or JWT here (if using JWT)
        res.json({ message: 'Login successful', userId: user._id });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start the server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
