import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { calculateWinner, getGameState } from './helper';

const app = express();
const PORT = 3000;

const server = createServer(app);

const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',  
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], 
      allowedHeaders: ['Content-Type'],  
    }
});

app.use(cors({
    origin: '*', 
    methods: '*',                   
    allowedHeaders: ['Content-Type'],
}));

let gameState = getGameState();

io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  socket.emit('gameState', gameState);

  socket.on('makeMove', (index) => {
    if (gameState.board[index] || gameState.winner) return; 
   
    gameState.board[index] = gameState.xIsNext ? 'X' : 'O';
    gameState.winner = calculateWinner(gameState.board);
    gameState.gameOver = gameState.winner != null;
    gameState.xIsNext = !gameState.xIsNext;

    io.emit('gameState', gameState);
  });

  socket.on('restart', () => {
    gameState = getGameState();
    io.emit('gameState', gameState, true);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected: ' + socket.id);
  });
});

app.get('/test', (req: Request, res: Response) => {
  res.send('Hello, Test!');
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});