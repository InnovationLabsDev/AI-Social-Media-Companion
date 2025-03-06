import express from 'express';
import cors from 'cors';
const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.json({ fruits: ['apple', 'banana', 'cherry'] });
    res.send('Hello World!');
});

app.listen(5000, () => {
    console.log("hello");
});