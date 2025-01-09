import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { calculateWinner, getGameState, players, isPlayer } from './helper';
import { Role } from './role.constants';

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

  socket.on('start', (playerId) => {
    const numberOfPlayers = players.length;

    if (players.some(p => p.playerId === playerId)) return;

    if (numberOfPlayers < 2)
    {
      const role = numberOfPlayers === 0 ? Role.X : numberOfPlayers === 1 ? Role.O : Role.Spectator;
      players.push({ playerId, role});
    }    

    io.emit('gameState', gameState, players, numberOfPlayers);
  });

  socket.on('makeMove', (index, playerId) => {

    if (gameState.winner ||
      gameState.board[index] ||
      players.every(p => p.playerId !== playerId) ||
      (isPlayer(playerId, Role.X) && !gameState.xIsNext) ||
      (isPlayer(playerId, Role.O) && gameState.xIsNext))
    {
      return;
    }
   
    gameState.board[index] = gameState.xIsNext ? Role.X : Role.O;
    gameState.winner = calculateWinner(gameState.board);
    gameState.gameOver = gameState.winner != null;
    gameState.xIsNext = !gameState.xIsNext;

    io.emit('gameState', gameState, players);
  });

  socket.on('restart', () => {
    gameState = getGameState();
    io.emit('gameState', gameState, players);
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