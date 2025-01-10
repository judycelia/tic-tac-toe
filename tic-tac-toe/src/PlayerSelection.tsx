import { Role } from "./role.constants";

function PlayerSelection({ players, onSelect }: { players: any[], onSelect: any }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg text-center w-[300px] shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Pick your player</h2>
                <div className="space-y-2">
                    { showOption(players, Role.X) &&
                        <button
                            onClick={() => onSelect(Role.X)}
                            className="w-full bg-red-500 text-white p-2 rounded hover:bg-blue-600">
                            Player X
                        </button> }
                    { showOption(players, Role.O) &&
                        <button
                            onClick={() => onSelect(Role.O)}
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-red-600">
                            Player O
                        </button> }
                    <button
                        onClick={() => onSelect(Role.Spectator)}
                        className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
                        Spectator
                    </button>
                </div>
            </div>
        </div>
    );
};

function showOption(players: any[], role: string): boolean {
    return players.length === 0 || players.some(p => p.role !== role);
}

export default PlayerSelection;