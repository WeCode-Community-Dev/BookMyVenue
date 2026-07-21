import express from 'express';
import dotenv from 'dotenv';
import routes from './src/routes/index.js';
import { globalErrorHandler } from './src/handlers/error_handlers.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { WebSocketServer } from 'ws';
import { addClient, removeClient } from './src/utils/wsClient.js';
import { verifyToken } from './src/utils/utils.js';
import {parseCookies} from './src/utils/utils.js';

import conversationService from './src/services/conversationService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Server is up and running');
});

app.use(routes);
app.use(globalErrorHandler);

// capture the return value of app.listen as server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  try {
    const cookies = parseCookies(req);
    const token = cookies['accessToken'];

    if (!token) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    const decoded = verifyToken(token);
    req.user = { id: decoded.userId, email: decoded.email, role: decoded.role };

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  } catch (err) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
  }
});

wss.on('connection', (ws, req) => {
  const userId = req.user.id;
  addClient(userId, ws);
  console.log(`WS connected: ${userId}`);

  ws.on('message', async (data) => {
    try {
      const { type, payload } = JSON.parse(data);
      if (type === 'SEND_MESSAGE') {
        const { conversationId, content, venueId } = payload;
        await conversationService.sendMessage(
          conversationId,
          userId,
          content,
          venueId
        );
      }
    } catch (err) {
      console.error(`Error handling message for ${userId}:`, err);
    }
  });

  ws.on('close', () => {
    removeClient(userId, ws);
    console.log(`WS disconnected: ${userId}`);
  });

  ws.on('error', (err) => {
    console.error(`WS error for ${userId}:`, err);
    removeClient(userId, ws);
  });
});