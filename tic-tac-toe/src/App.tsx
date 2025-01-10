import { useState, Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import io, { Socket } from 'socket.io-client';
import { GameBoard } from './game-board.model';
import { Role } from './role.constants';
import Board from './Board';
import GameOver from './GameOver';
import InfoBoard from './InfoBoard';
import PlayerSelection from './PlayerSelection';

const socket = io('http://localhost:3000');

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [playerSelected, setPlayerSelected] = useState(false);
  const socketRef =  useRef<Socket | null>(null);
  const playerIdRef = useRef('');

  if (!playerIdRef.current) {
    playerIdRef.current = (Date.now() + Math.floor(Math.random() * 1000)).toString();
  }  

  useEffect(() => {
    socketRef.current = io('http://localhost:3000');

    socketRef.current.on('gameState', (gameState: GameBoard, players: any[], restart: boolean = false) => {
      setBoard(gameState.board);
      setXIsNext(gameState.xIsNext);
      setWinner(gameState.winner);
      setGameOver(gameState.gameOver);
      setPlayers(players);

      if(restart){
        setPlayerSelected(false);
      }
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

  const handlePlayerSelect = (role: string) => {
    setPlayerSelected(true);
    socket.emit('updatePlayers', playerIdRef.current, role); 
  };

  const isPlayer = players.some(p => p.playerId === playerIdRef.current);
  const role = players.find(p => p.playerId === playerIdRef.current)?.role ?? Role.Spectator;
  const showPlayerSelection = players.length < 2 && !playerSelected;
  
  return (
    <div className="h-screen bg-gradient-to-b from-sky-300 to-white">
      { showPlayerSelection && <PlayerSelection players={players} onSelect={handlePlayerSelect}/> }

      { !showPlayerSelection &&
        <Canvas className="canvas-container">
          <Suspense fallback={null}>
            <ambientLight intensity={.8} />
            <spotLight position={[0, 5, 10]} angle={0.5} penumbra={1} intensity={2}/>
            <Board boardState={board} onClick={handleClick}/>
          </Suspense>
          <OrbitControls />
        </Canvas>   
      }   
      
      { !showPlayerSelection && !gameOver &&
        <InfoBoard showRestart={isPlayer && board.some(b => b != null)} xIsNext={xIsNext} role={role} onClick={handleRestart}/>}

      {  !showPlayerSelection && gameOver && <GameOver winner={winner} onClick={handleRestart} isPlayer={isPlayer}/> }        
    </div>
  );
}

export default App;