import express from 'express';
import cors from 'cors';
import { environment } from './config/enviroment.js';
import { chatRouter } from './router/chat.route.js';

const app = express();
const PORT = environment.port;

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the MovieIA backend!');
});

app.use('/api/v1', chatRouter);

function main() {

    try {
        app.listen(PORT, () => {
            console.log(`✅ Server is running on port http://localhost:${PORT}`);
        });    
    } catch (error) {
        console.error(`❌ Error starting server: ${error.message}`);
    }
}

main();