function GameOver({ winner, onClick, isPlayer }:
     { winner: string | null, onClick: any, isPlayer: boolean }){

    const message = winner === null ? `Game draw!` : `Game over. Winner is '${winner}'!`

    return (
        <div className="modal">
            <div className="bg-white p-5 rounded-lg text-center w-[300px]">
                <p className='font-bold text-xl'>{message}</p>
                { isPlayer && <button onClick={onClick} className="restart-button">Restart Game</button> }
            </div>
        </div>
    );
}

export default GameOver;