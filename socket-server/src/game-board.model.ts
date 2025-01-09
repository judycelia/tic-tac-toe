export interface GameBoard {
    board: string[],
    winner: string | null,
    gameOver: boolean,  
    xIsNext: boolean
}