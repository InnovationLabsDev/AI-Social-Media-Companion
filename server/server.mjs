import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

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
        const [rows] = await pool.query('SELECT id, name, email, picture FROM users');

        // Convert BLOB to Base64
        const users = rows.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            picture: user.picture ? `data:image/png;base64,${user.picture.toString('base64')}` : null
        }));

        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
