import type { GenerationNum, GenerationOption } from "../types";

const GENERATIONS: GenerationOption[] = [
  { num: 9, label: "Gen 9 (Scarlet/Violet)", shortLabel: "Gen 9" },
  { num: 8, label: "Gen 8 (Sword/Shield)", shortLabel: "Gen 8" },
  { num: 7, label: "Gen 7 (Sun/Moon)", shortLabel: "Gen 7" },
  { num: 6, label: "Gen 6 (X/Y)", shortLabel: "Gen 6" },
  { num: 5, label: "Gen 5 (Black/White)", shortLabel: "Gen 5" },
  { num: 4, label: "Gen 4 (Diamond/Pearl)", shortLabel: "Gen 4" },
  { num: 3, label: "Gen 3 (Ruby/Sapphire)", shortLabel: "Gen 3" },
];

interface GenerationSelectProps {
  generation: GenerationNum;
  onGenerationChange: (gen: GenerationNum) => void;
  disabled?: boolean;
  isRetro?: boolean;
}

export function GenerationSelect({
  generation,
  onGenerationChange,
  disabled = false,
  isRetro = false,
}: GenerationSelectProps) {
  if (isRetro) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-bold text-orange-700">
          🎮 Game Version:
        </span>
        <select
          value={generation}
          onChange={(e) => onGenerationChange(Number(e.target.value) as GenerationNum)}
          disabled={disabled}
          className="retro-input px-3 py-2 text-black font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {GENERATIONS.map((gen) => (
            <option key={gen.num} value={gen.num}>
              {gen.label}
            </option>
          ))}
        </select>
        <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-1 border border-purple-400">
          Only moves learnable in this gen!!
        </span>
      </div>
    );
  }

  // Modern theme
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Game Version:</span>
      <select
        value={generation}
        onChange={(e) => onGenerationChange(Number(e.target.value) as GenerationNum)}
        disabled={disabled}
        className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 font-medium cursor-pointer focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {GENERATIONS.map((gen) => (
          <option key={gen.num} value={gen.num}>
            {gen.label}
          </option>
        ))}
      </select>
      <span className="text-xs text-gray-500">
        Only shows moves learnable in this generation
      </span>
    </div>
  );
}
