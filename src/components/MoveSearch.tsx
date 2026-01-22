import { useState, useMemo } from "react";
import type { MoveData } from "../types";

const typeColors: Record<string, string> = {
  Normal: "bg-gray-400",
  Fire: "bg-red-500",
  Water: "bg-blue-500",
  Electric: "bg-yellow-400",
  Grass: "bg-green-500",
  Ice: "bg-cyan-300",
  Fighting: "bg-orange-700",
  Poison: "bg-purple-500",
  Ground: "bg-amber-600",
  Flying: "bg-indigo-300",
  Psychic: "bg-pink-500",
  Bug: "bg-lime-500",
  Rock: "bg-stone-500",
  Ghost: "bg-purple-700",
  Dragon: "bg-violet-600",
  Dark: "bg-gray-700",
  Steel: "bg-slate-400",
  Fairy: "bg-pink-300",
};

interface MoveSearchProps {
  allMoves: MoveData[];
  selectedMoves: string[];
  onMovesChange: (moves: string[]) => void;
}

export function MoveSearch({
  allMoves,
  selectedMoves,
  onMovesChange,
}: MoveSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredMoves = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allMoves
      .filter(
        (m) =>
          m.name.toLowerCase().includes(query) &&
          !selectedMoves.includes(m.name)
      )
      .slice(0, 10);
  }, [searchQuery, allMoves, selectedMoves]);

  const getSelectedMoveData = (moveName: string): MoveData | undefined => {
    return allMoves.find((m) => m.name === moveName);
  };

  const handleAddMove = (moveName: string) => {
    if (!selectedMoves.includes(moveName)) {
      onMovesChange([...selectedMoves, moveName]);
    }
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleRemoveMove = (moveName: string) => {
    onMovesChange(selectedMoves.filter((m) => m !== moveName));
  };

  const handleClearAll = () => {
    onMovesChange([]);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-blue-700">💥 Search for Moves!! 💥</h2>

      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Type a move name..."
          className="retro-input w-full px-3 py-2 text-black"
        />
        {showDropdown && filteredMoves.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border-2 border-black max-h-60 overflow-auto shadow-[4px_4px_0_#000]">
            {filteredMoves.map((move) => (
              <li
                key={move.id}
                onClick={() => handleAddMove(move.name)}
                className="px-3 py-2 cursor-pointer hover:bg-yellow-300 flex items-center justify-between border-b border-gray-300"
              >
                <span className="font-bold">{move.name}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 border border-black text-xs text-white font-bold ${
                      typeColors[move.type] || "bg-gray-500"
                    }`}
                  >
                    {move.type}
                  </span>
                  <span className="text-xs font-bold text-gray-700">{move.category}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedMoves.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-purple-200 border-2 border-purple-500 px-2 py-1">
            <span className="text-sm font-bold text-purple-800">
              ✨ {selectedMoves.length} move{selectedMoves.length !== 1 ? "s" : ""}{" "}
              selected!! ✨
            </span>
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-800 font-bold cursor-pointer underline"
            >
              [Clear All]
            </button>
          </div>
          <div className="flex flex-wrap gap-2 p-2 bg-gradient-to-b from-yellow-100 to-yellow-200 border-2 border-yellow-400">
            {selectedMoves.map((moveName) => {
              const moveData = getSelectedMoveData(moveName);
              return (
                <span
                  key={moveName}
                  className={`inline-flex items-center gap-1 px-2 py-1 border-2 border-black text-sm text-white font-bold shadow-[2px_2px_0_#000] ${
                    typeColors[moveData?.type || ""] || "bg-gray-500"
                  }`}
                >
                  {moveName}
                  <button
                    onClick={() => handleRemoveMove(moveName)}
                    className="ml-1 hover:opacity-80 font-bold cursor-pointer"
                  >
                    ✖
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
