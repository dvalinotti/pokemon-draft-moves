import type { SearchLogic } from "../types";

interface LogicToggleProps {
  logic: SearchLogic;
  onLogicChange: (logic: SearchLogic) => void;
  disabled?: boolean;
}

export function LogicToggle({
  logic,
  onLogicChange,
  disabled,
}: LogicToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Search Logic:</span>
      <div className="flex rounded-lg overflow-hidden border border-gray-300">
        <button
          onClick={() => onLogicChange("AND")}
          disabled={disabled}
          className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
            logic === "AND"
              ? "bg-purple-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          AND
        </button>
        <button
          onClick={() => onLogicChange("OR")}
          disabled={disabled}
          className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 cursor-pointer ${
            logic === "OR"
              ? "bg-purple-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          OR
        </button>
      </div>
      <span className="text-xs text-gray-500">
        {logic === "AND"
          ? "Pokemon must learn ALL moves"
          : "Pokemon must learn ANY move"}
      </span>
    </div>
  );
}
