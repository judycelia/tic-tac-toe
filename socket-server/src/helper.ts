import { GameBoard } from "./game-board.model";

export let players: any[] = [];

export function isPlayer(playerId: string, role: string) {
  return players.some(p => p.playerId === playerId &&  p.role === role);
}

export function calculateWinner(squares: string[]): string | null {
    // Represent the 3 rows, 3 columns, and 2 diagonals.
    const rows = [squares.slice(0, 3), squares.slice(3, 6), squares.slice(6, 9)];
    const cols = [
      [squares[0], squares[3], squares[6]],
      [squares[1], squares[4], squares[7]],
      [squares[2], squares[5], squares[8]],
    ];
    const diagonals = [
      [squares[0], squares[4], squares[8]],  // top-left to bottom-right
      [squares[2], squares[4], squares[6]],  // top-right to bottom-left
    ];
  
    // Check rows, columns, and diagonals for a winner.
    const lines = [...rows, ...cols, ...diagonals];
    for (const line of lines) {
      if (line[0] && line[0] === line[1] && line[0] === line[2]) {
        return line[0]; // Return the winner ('X' or 'O') if found
      }
    }
  
    return null; // No winner found
}

export function getGameState(): GameBoard {
    return {
        board: Array(9).fill(null),
        winner: null,
        gameOver: false,  
        xIsNext: true           
    };
} 