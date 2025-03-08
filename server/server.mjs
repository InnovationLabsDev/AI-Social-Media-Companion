import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';
import { GoogleGenerativeAI} from '@google/generative-ai';
import fs from 'fs';

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());


// Database connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'PostPal_4',
    database: 'postpal',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Route to fetch data
app.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, email, password, picture FROM users');

        // Convert BLOB to Base64
        const users = rows.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            picture: user.picture ? `data:image/png;base64,${user.picture.toString('base64')}` : null
        }));

        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

app.get('/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, photo FROM photos');

        // Convert BLOB to Base64
        const users = rows.map(user => ({
            id: user.id,
            photo: user.photo ? `data:image/jpg;base64,${user.photo.toString('base64')}` : null
        }));

        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

app.post("/", async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = rows[0];

        console.log("Stored Hashed Password:", user.password);
        console.log("Entered Password:", password);

        // Now compare plain-text password with the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        console.log("Password Match:", passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        res.json({ message: "Login successful", user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/register", async (req, res) => {
    const {email, password, name} = req.body;
    console.log(email, password, name);


    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store the user in the database
        const [result] = await pool.query("INSERT INTO users (email, password, name) VALUES (?, ?, ?)", [email, hashedPassword, name]);

        res.json({ userId: result.insertId });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType,
        },
    };
}

// Route to generate caption & hashtags
app.get('/caption', async (req, res) => {
    try {
        // Get all photo IDs
        const [rows_id] = await pool.query('SELECT id FROM photos');

        if (rows_id.length === 0) {
            return res.status(404).json({ error: "No images found in the database" });
        }

        // Pick the first available ID (or choose a specific one)
        const photoId = rows_id[0].id;  

        // Fetch the corresponding image from the database
        const [rows] = await pool.query('SELECT photo FROM photos WHERE id = ?', [photoId]);

        if (rows.length === 0 || !rows[0].photo) {
            return res.status(404).json({ error: "Image not found" });
        }

        // Convert BLOB image to Base64
        const base64Image = rows[0].photo.toString('base64');
        const imageData = `data:image/jpg;base64,${base64Image}`;

        // Google Gemini API Setup
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Generate a creative social media caption with hashtags for this image.";
        const imagePart = { inlineData: { data: base64Image, mimeType: "image/jpeg" } };

        const result = await model.generateContent([prompt, imagePart]);
        const caption = result.response.text();

        res.json({ caption });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Failed to generate caption" });
    }
});

// app.get("/caption", (req, res) => {
//     const photoId = req.params.id;

//     try {
//         // Fetch the image from the database
//         const [rows] = pool.query("SELECT photo FROM photos WHERE id = ?", [photoId]);

//         if (rows.length === 0) {
//             return res.status(404).json({ error: "Image not found" });
//         }

//         // Convert BLOB to Base64
//         const imageBase64 = rows[0].photo ? rows[0].photo.toString("base64") : null;

//         if (!imageBase64) {
//             return res.status(400).json({ error: "Invalid image data" });
//         }

//         // Define the prompt
//         const prompt = "Generate a creative and engaging social media caption with relevant hashtags for this image.";

//         // Make API request to Gemini
//         const response = axios.post(
//             `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key=${GEMINI_API_KEY}`,
//             {
//                 prompt: {
//                     text: prompt,
//                     image: `data:image/jpg;base64,${imageBase64}` // Ensure correct format
//                 }
//             }
//         );

//         const result = response.data;

//         res.json({ caption: result.choices[0].text });

//     } catch (error) {
//         console.error("Gemini API Error:", error.response?.data || error.message);
//         res.status(500).json({ error: "Failed to generate caption" });
//     }
// });

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
