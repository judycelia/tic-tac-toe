import { useState, Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Board from './Board';
import io, { Socket } from 'socket.io-client';
import { GameBoard } from './game-board.model';
import { Role } from './role.constants';

const socket = io('http://localhost:3000');

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const socketRef =  useRef<Socket | null>(null);
  const playerIdRef = useRef('');

  if (!playerIdRef.current) {
    playerIdRef.current = (Date.now() + Math.floor(Math.random() * 1000)).toString();
  }  

  useEffect(() => {
    socketRef.current = io('http://localhost:3000');

    socket.emit('start', playerIdRef.current); 

    socketRef.current.on('gameState', (gameState: GameBoard, players: any[]) => {
      setBoard(gameState.board);
      setXIsNext(gameState.xIsNext);
      setWinner(gameState.winner);
      setGameOver(gameState.gameOver);
      setPlayers(players);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off('gameState');
      }
    };
  }, []);

  const handleClick = (index: any) => {
    socket.emit('makeMove', index, playerIdRef.current); 
  };

  const handleRestart = () => {
    socket.emit('restart');
  };

  const status = gameOver ? `Game over. Winner is ${winner}!` : `Next move: ${xIsNext ? "X" : "O"}`;
  const role = players.find(p => p.playerId === playerIdRef.current)?.role ?? Role.Spectator;
  const playerInfo = role === Role.Spectator ? `You are a spectator` : `You are player '${role}'`;

  return (
    <div className="h-screen bg-gradient-to-b from-sky-300 to-white">
      <Canvas className="canvas-container">
        <Suspense fallback={null}>
          <ambientLight intensity={.8} />
          <spotLight position={[0, 5, 10]} angle={0.5} penumbra={1} intensity={2}/>
          <Board boardState={board} handleClick={handleClick}/>
        </Suspense>
        <OrbitControls />
      </Canvas>
      
      {!gameOver && 
        <div className="flex flex-col justify-center items-center">
          <p className='font-bold text-xl text-blue-600'>{playerInfo}</p>
          <p className='font-bold text-xl p-5'>{status}</p>

          { isPlayer(players, playerIdRef.current) && 
            board.some(b => b != null) && 
            <button onClick={handleRestart} className="restart-button">Restart Game</button> }        
        </div>}

      {gameOver &&
        <div className="modal">
          <div className="bg-white p-5 rounded-lg text-center w-[300px]">
            <p className='font-bold text-xl'>{status}</p>
            { isPlayer(players, playerIdRef.current) &&
              <button onClick={handleRestart} className="restart-button">Restart Game</button> }
          </div>
        </div>
      }
    </div>
  );
}

function isPlayer(players: any[], playerId: string): boolean {
  return players.some(p => p.playerId === playerId);
}

export default App;