import { useState, Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Board from './Board';
import io, { Socket } from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [player, setPlayer] = useState<string | null>(null);
  const socketRef =  useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3000');

    socketRef.current.on('gameState', (gameState: any, isRestart: boolean = false) => {
      setBoard(gameState.board);
      setXIsNext(gameState.xIsNext);
      setWinner(gameState.winner);
      setGameOver(gameState.gameOver);

      if(isRestart){
        setPlayer(null);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off('gameState');
      }
    };
  }, []);

  const handleClick = (index: any) => {

    if(winner ||
        board[index]
        (player === 'X' && !xIsNext) ||
        (player === 'O' && xIsNext)){
      return;
    }

    setPlayer(xIsNext ? 'X' : 'O');
    socket.emit('makeMove', index); 
  };

  const handleRestart = () => {
    socket.emit('restart');
  };

  const status = gameOver ? `Game over. Winner is ${winner}!` : `Next player: ${xIsNext ? "X" : "O"}`;

  return (
    <div className="w-full h-[98vh]">
      <Canvas className="canvas-container">
        <Suspense fallback={null}>
          <ambientLight intensity={.8} />
          <spotLight position={[0, 5, 10]} angle={0.5} penumbra={1} intensity={2}/>
          <Board boardState={board} handleClick={handleClick}/>
        </Suspense>
        <OrbitControls />
      </Canvas>
      
      {!gameOver && 
        <div className="flex flex-col justify-center items-center text-black">
          <p className='font-bold text-xl'>{status}</p>

          { board.some(b => b != null) && <button onClick={handleRestart} className="restart-button">Restart Game</button> }        
        </div>}

      {gameOver &&
        <div className="modal">
          <div className="bg-white p-5 rounded-lg text-center w-[300px]">
            <p className='font-bold text-xl'>{status}</p>
            <button onClick={handleRestart} className="restart-button">Restart Game</button>
          </div>
        </div>
      }
    </div>
  );
}

export default App;