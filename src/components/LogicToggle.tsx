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
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-bold text-fuchsia-700">⚙️ Search Mode:</span>
      <div className="flex border-2 border-black shadow-[2px_2px_0_#000]">
        <button
          onClick={() => onLogicChange("AND")}
          disabled={disabled}
          className={`px-4 py-2 text-sm font-bold cursor-pointer border-r-2 border-black ${
            logic === "AND"
              ? "bg-gradient-to-b from-lime-400 to-lime-600 text-black"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          🔗 AND
        </button>
        <button
          onClick={() => onLogicChange("OR")}
          disabled={disabled}
          className={`px-4 py-2 text-sm font-bold cursor-pointer ${
            logic === "OR"
              ? "bg-gradient-to-b from-orange-400 to-orange-600 text-black"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          ⚡ OR
        </button>
      </div>
      <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 border border-blue-400">
        {logic === "AND"
          ? "Pokemon must learn ALL moves!!"
          : "Pokemon must learn ANY move!!"}
      </span>
    </div>
  );
}
