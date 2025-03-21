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
import { uploadToCloudinary } from './models/cloudinaryService.mjs';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

let userId = null;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

const storage = multer.memoryStorage(); // Store files in memory (for Cloudinary streaming)
const upload = multer({ storage: storage }); // Initialize multer with memory storage

// // Create basic routes
// app.get('/', (req, res) => {
//     res.send("Hello, World!");
// });

app.post('/main-page', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    // console.log(result);
    
    // Example transformation on the uploaded image
    const url = cloudinary.url(result.public_id, {
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    console.log('Generated URL with transformations:', url);

    const photo = new Photo({
        title: req.body.title || req.file.originalname,
        url: url,
        caption: req.body.caption || [],
        hashtags: req.body.hashtags || [],
        user: userId,
    });

    await photo.save();

    await generateCaptions(userId, url);

    // Respond with the Cloudinary URL (optional)
    res.status(200).json({
      message: 'File uploaded to Cloudinary',
      title: req.file.originalname,
      user: userId,
      url 
    });

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

        userId = user._id;
        // Return success message or JWT here (if using JWT)
        res.json({ message: 'Login successful', userId: user._id });
        

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

async function generateCaptions(userId, imageUrl) {
    try {
        const imageBuffer = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(imageBuffer.data).toString('base64');

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Generate 5 creative social media captions with 3-5 hashtags for this image.";
        const imagePart = { inlineData: { data: base64Image, mimeType: "image/jpeg" } };

        const result = await model.generateContent([prompt, imagePart]);
        const responseText = result.response.text();

        console.log("Generated caption:", responseText);
        return responseText; // Optionally save it in DB
    } catch (error) {
        console.error("Caption generation error:", error);
    }
}

app.get('/last-photo/:userId', async (req, res) => {
    try {
        // const { userId } = req.params;
        console.log("Received userId:", userId);


        // Convert userId to ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const lastPhoto = await Photo.findOne({ user: new mongoose.Types.ObjectId(userId) })
            .sort({ createdAt: -1 }) // Get the most recent photo
            .exec();

        if (!lastPhoto) {
            return res.status(404).json({ error: "No photos found for this user" });
        }

        // INCEARCA SA MUTI IN ALTA FUNCTIE
        
        await generateCaptions(userId, lastPhoto.url);
        // const imageUrl = lastPhoto.url;
        // const imageBuffer = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        // const base64Image = Buffer.from(imageBuffer.data).toString('base64');

        // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // const promt = "Generate 5 creative social media caption with 3-5 hashtags for this image. Write only the captions and hashtags. Do not write anything else.";
        // const imagePart = { inlineData: { data: base64Image, mimeType: "image/jpeg" } };

        // const result = await model.generateContent([promt, imagePart]);
        // const responseText = result.response.text();

        // if (!responseText) {
        //     return res.status(500).json({ error: "Error generating caption" });
        // }

        // console.log("Generated caption:", responseText);
        res.status(200).json(lastPhoto);
    } catch (error) {
        console.error("Error fetching last photo:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Start the server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
