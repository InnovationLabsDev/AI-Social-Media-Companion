import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';


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

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
