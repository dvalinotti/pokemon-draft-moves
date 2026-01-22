import { useState, useMemo } from "react";
import type { PokemonData, InputMode } from "../types";
import { getPokemonSpriteUrl } from "../utils/sprites";

interface PokemonInputProps {
  allPokemon: PokemonData[];
  selectedPokemon: string[];
  onPokemonChange: (pokemon: string[]) => void;
  findPokemon: (query: string) => PokemonData | undefined;
}

export function PokemonInput({
  allPokemon,
  selectedPokemon,
  onPokemonChange,
  findPokemon,
}: PokemonInputProps) {
  const [inputMode, setInputMode] = useState<InputMode>("dropdown");
  const [searchQuery, setSearchQuery] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredPokemon = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allPokemon
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query) &&
          !selectedPokemon.includes(p.name)
      )
      .slice(0, 10);
  }, [searchQuery, allPokemon, selectedPokemon]);

  const handleAddPokemon = (pokemonName: string) => {
    if (!selectedPokemon.includes(pokemonName)) {
      onPokemonChange([...selectedPokemon, pokemonName]);
    }
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleRemovePokemon = (pokemonName: string) => {
    onPokemonChange(selectedPokemon.filter((p) => p !== pokemonName));
  };

  const handlePasteSubmit = () => {
    const names = pasteText
      .split(/[,\n]/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    const validPokemon: string[] = [];
    for (const name of names) {
      const found = findPokemon(name);
      if (
        found &&
        !selectedPokemon.includes(found.name) &&
        !validPokemon.includes(found.name)
      ) {
        validPokemon.push(found.name);
      }
    }

    if (validPokemon.length > 0) {
      onPokemonChange([...selectedPokemon, ...validPokemon]);
    }
    setPasteText("");
  };

  const handleClearAll = () => {
    onPokemonChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Your Pokemon</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setInputMode("dropdown")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              inputMode === "dropdown"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Search
          </button>
          <button
            onClick={() => setInputMode("paste")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              inputMode === "paste"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Paste List
          </button>
        </div>
      </div>

      {inputMode === "dropdown" ? (
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search for a Pokemon..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          {showDropdown && filteredPokemon.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {filteredPokemon.map((pokemon) => (
                <li
                  key={pokemon.id}
                  onClick={() => handleAddPokemon(pokemon.name)}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <img
                    src={getPokemonSpriteUrl(pokemon.num, pokemon.id)}
                    alt={pokemon.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {pokemon.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste Pokemon names (comma or newline separated)..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none h-32 resize-none"
          />
          <button
            onClick={handlePasteSubmit}
            disabled={!pasteText.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Add Pokemon
          </button>
        </div>
      )}

      {selectedPokemon.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedPokemon.length} Pokemon selected
            </span>
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-700 font-medium cursor-pointer"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedPokemon.map((pokemonName) => {
              const pokemonData = findPokemon(pokemonName);
              return (
                <span
                  key={pokemonName}
                  className="inline-flex items-center gap-1 pl-1 pr-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {pokemonData && (
                    <img
                      src={getPokemonSpriteUrl(pokemonData.num, pokemonData.id)}
                      alt={pokemonName}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                  {pokemonName}
                  <button
                    onClick={() => handleRemovePokemon(pokemonName)}
                    className="ml-1 text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
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
