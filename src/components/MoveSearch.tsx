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
      <h2 className="text-lg font-semibold text-gray-800">Search Moves</h2>

      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search for a move..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
        />
        {showDropdown && filteredMoves.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredMoves.map((move) => (
              <li
                key={move.id}
                onClick={() => handleAddMove(move.name)}
                className="px-4 py-2 cursor-pointer hover:bg-purple-50 transition-colors flex items-center justify-between"
              >
                <span>{move.name}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs text-white ${
                      typeColors[move.type] || "bg-gray-500"
                    }`}
                  >
                    {move.type}
                  </span>
                  <span className="text-xs text-gray-500">{move.category}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedMoves.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedMoves.length} move{selectedMoves.length !== 1 ? "s" : ""}{" "}
              selected
            </span>
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-700 font-medium cursor-pointer"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedMoves.map((moveName) => {
              const moveData = getSelectedMoveData(moveName);
              return (
                <span
                  key={moveName}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm text-white ${
                    typeColors[moveData?.type || ""] || "bg-gray-500"
                  }`}
                >
                  {moveName}
                  <button
                    onClick={() => handleRemoveMove(moveName)}
                    className="ml-1 hover:opacity-80 font-bold cursor-pointer"
                  >
                    x
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
