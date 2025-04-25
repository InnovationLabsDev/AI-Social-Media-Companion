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
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const hasSynced = new Set();

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

let userId = null;
let userName = null;

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

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

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

    const text = await generateCaptions(userId, url);

    const lines = text.split("\n").map(line => line.trim()).filter(line => line.length > 0);

    const captions = [];
    const hashtags = [];

    lines.forEach(line => {
        const extractedHashtags = line.match(/#\w+/g) || []; // Extract hashtags
        const extractCaptions = (text) => {
            return text
                .replace(/Here are five.*?:/, "") // Remove AI intro text
                .replace(/Here are 5.*?:/, "") // Remove AI intro text
                .split(/\*\*Caption \d+:\*\*/i) // Split at "Caption 1:", "Caption 2:" etc.
                .map(line => line.trim()) // Trim whitespace
                .filter(line => line.length > 0); // Remove empty entries
        };

        const cleanCaptions = (text) => {
            return text
                .split(/\n/) // Split into lines
                .map(line => line.replace(/^\d+\.\s*\*\*"|"?\*\*$/g, "").trim()) // Remove numbers, "**", and quotes
                .map(line => line.replace(/#\w+/g, "").trim()) // Remove hashtags
                .map(line => line.replace(/^\d+\.\s*/, "").trim())
                .map(line => line.replace(/"/g, "").trim()) // Remove double quotes
                .map(line => line.replace(/\*/g, "").trim()) // Remove asterisks
                .map(line => line.replace(/^\d+\.\s*/, "").trim()) // Remove numbers like "1."
                .map(line => line.replace(/>/g, "").trim()) // Remove greater than signs
                .filter(line => line.length > 0); // Remove empty lines
        };
        
        const extractedCaptions = extractCaptions(line).map(cleanCaptions).flat();
        if (extractedCaptions.length) captions.push(...extractedCaptions);
        if (extractedHashtags.length) hashtags.push(...extractedHashtags);
    });

    const uniqueHashtags = [...new Set(hashtags)]; // Remove duplicates

    // console.log("Extracted captions:", captions);
    // console.log("Extracted hashtags:", uniqueHashtags);

    const photo = new Photo({
        title: req.body.title || req.file.originalname,
        url: url,
        caption: captions || [],
        hashtags: uniqueHashtags || [],
        user: userId,
    });

    await photo.save();

    // await generateCaptions(userId, url);

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
    console.log('[login] incoming request at', new Date().toISOString());
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
  
    try {
      // 1) Authenticate
      const user = await User.findOne({ $or: [{ email }, { name: email }] });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      // 2) Prepare userId
      const userId = user._id.toString();
  
      // 3) Start the Python sync in background, but only once per 10 seconds
      if (!hasSynced.has(userId)) {
        hasSynced.add(userId);
  
        const scriptPath = path.join(__dirname, 'scripts', 'fetchCalendar.py');
        const cmd        = `python "${scriptPath}" --user-id ${userId}`;
        exec(cmd, { env: process.env }, (err, stdout, stderr) => {
          if (err) console.error('Calendar sync error for user', userId, stderr);
          else     console.log('Calendar sync output for user', userId, stdout);
        });
  
        // clear the flag after 10 seconds so future logins will sync again
        setTimeout(() => {
          hasSynced.delete(userId);
        }, 10_000);
      }
  
      // 4) Send the login response
      return res.json({
        message: 'Login successful, calendar sync started if not already in last 10s',
        userId,
        name: user.name
      });
  
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ error: 'Server error' });
    }
  });

async function generateCaptions(userId, imageUrl) {
    try {
        const imageBuffer = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(imageBuffer.data).toString('base64');

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Generate 5 creative social media captions with 3-5 hashtags for this image," + 
        " with the location being Adobe and the date of the Second Bootcamp at InnovationLabs.";
        const imagePart = { inlineData: { data: base64Image, mimeType: "image/jpeg" } };

        const result = await model.generateContent([prompt, imagePart]);
        const responseText = result.response.text();

        console.log("Generated caption:", responseText);
        return responseText; // Optionally save it in DB
    } catch (error) {
        console.error("Caption generation error:", error);
    }
}

app.get('/photo/:userId/:skipCount', async (req, res) => {
    try {
        const { userId, skipCount } = req.params;
        console.log(`Received userId: ${userId}, skipping ${skipCount} photos`);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const photo = await Photo.find({ user: new mongoose.Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .skip(parseInt(skipCount))
            .limit(1)
            .exec();

        if (!photo.length) {
            return res.status(404).json({ error: "No more photos available" });
        }

        res.status(200).json(photo[0]);
    } catch (error) {
        console.error("Error fetching photo:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});




// Start the server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
