import express from 'express';
import cors from 'cors';
import { environment } from './config/enviroment.js';
import { chatRouter } from './router/chat.route.js';

const app = express();
const PORT = environment.port;

app.use(cors());
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