import { Role } from "./role.constants";

function InfoBoard({ showRestart, xIsNext, role, onClick } :
    { showRestart: boolean, xIsNext: boolean, role: string, onClick: any }) {
    
    const playerInfo = role === Role.Spectator ? `You are a spectator` : `You are player '${role}'`;

    return (
        <div className="flex flex-col justify-center items-center">
          <p className='font-bold text-xl text-blue-600'>{playerInfo}</p>
          <p className='font-bold text-xl p-5'>Next move: {xIsNext ? "X" : "O"}</p>

          { showRestart && <button onClick={onClick} className="restart-button">Restart Game</button> }        
        </div>
    );
}

export default InfoBoard;