import Box from './Box';

function Board({ boardState, handleClick }: { boardState: any, handleClick: any}) {
    const boardPositions = [
        [-1, 1, 0], [0, 1, 0], [1, 1, 0],
        [-1, 0, 0], [0, 0, 0], [1, 0, 0],
        [-1, -1, 0], [0, -1, 0], [1, -1, 0],
    ];

    return (
        <>
        {boardPositions.map((position, index) => (
                <Box
                key={index}
                position={position}
                onClick={() => handleClick(index)}
                color={boardState[index] === 'X' ? 'red' : boardState[index] === 'O' ? 'blue' : index % 2 ? 'gray' : 'white'}
                player={boardState[index]}
                />
            ))}
        </>
    );
}

export default Board;