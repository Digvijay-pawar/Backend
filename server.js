import express from 'express';
import http from 'http';
import path from 'path';
import WebSocket from 'ws'; // Import WebSocket
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import balanceRoutes from './routes/balanceRoutes.js';
import cors from 'cors';
import { checkBalance } from './controllers/balanceController.js'; // Import checkBalance function

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocket.Server({ server });

// WebSocket connection handling
wss.on('connection', function connection(ws) {
  console.log('A new client connected to WebSocket');

  ws.on('message', async function incoming(message) {
    console.log('Received message from client:', message);
    const data = JSON.parse(message);

    // Handle balance request
    if (data.type === 'balanceRequest') {
      try {
        const { mobileNumber } = data;
        const balanceResponse = await checkBalance({ body: { mobileNumber } }); // Call checkBalance function
        ws.send(JSON.stringify({ type: 'balanceResponse', balance: balanceResponse.balance }));
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    }
  });
});

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use('/api/users', userRoutes);
app.use('/api/balance', balanceRoutes);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
