import { useState, useMemo } from "react";
import type { PokemonData, InputMode } from "../types";
import { getPokemonSpriteUrl } from "../utils/sprites";

interface PokemonInputProps {
  allPokemon: PokemonData[];
  selectedPokemon: string[];
  onPokemonChange: (pokemon: string[]) => void;
  findPokemon: (query: string) => PokemonData | undefined;
  isRetro?: boolean;
}

export function PokemonInput({
  allPokemon,
  selectedPokemon,
  onPokemonChange,
  findPokemon,
  isRetro = false,
}: PokemonInputProps) {
  const [inputMode, setInputMode] = useState<InputMode>("dropdown");
  const [searchQuery, setSearchQuery] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [invalidNames, setInvalidNames] = useState<string[]>([]);

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
    const notFound: string[] = [];

    for (const name of names) {
      const found = findPokemon(name);
      if (found) {
        if (
          !selectedPokemon.includes(found.name) &&
          !validPokemon.includes(found.name)
        ) {
          validPokemon.push(found.name);
        }
      } else {
        notFound.push(name);
      }
    }

    if (validPokemon.length > 0) {
      onPokemonChange([...selectedPokemon, ...validPokemon]);
    }

    setInvalidNames(notFound);
    setPasteText("");
  };

  const dismissError = () => {
    setInvalidNames([]);
  };

  const handleClearAll = () => {
    onPokemonChange([]);
  };

  if (isRetro) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-fuchsia-700">⚡ Add Your Pokemon!! ⚡</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setInputMode("dropdown")}
              className={`retro-btn cursor-pointer text-sm ${
                inputMode === "dropdown"
                  ? "!bg-gradient-to-b !from-blue-400 !to-blue-600 !text-white"
                  : ""
              }`}
            >
              🔍 Search
            </button>
            <button
              onClick={() => setInputMode("paste")}
              className={`retro-btn cursor-pointer text-sm ${
                inputMode === "paste"
                  ? "!bg-gradient-to-b !from-blue-400 !to-blue-600 !text-white"
                  : ""
              }`}
            >
              📋 Paste List
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
              placeholder="Type a Pokemon name..."
              className="retro-input w-full px-3 py-2 text-black"
            />
            {showDropdown && filteredPokemon.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border-2 border-black max-h-60 overflow-auto shadow-[4px_4px_0_#000]">
                {filteredPokemon.map((pokemon) => (
                  <li
                    key={pokemon.id}
                    onClick={() => handleAddPokemon(pokemon.name)}
                    className="px-3 py-2 cursor-pointer hover:bg-yellow-300 flex items-center gap-2 border-b border-gray-300"
                  >
                    <img
                      src={getPokemonSpriteUrl(pokemon.num, pokemon.id)}
                      alt={pokemon.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <span className="font-bold">{pokemon.name}</span>
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
              placeholder="Paste Pokemon names here!! (comma or newline separated)"
              className="retro-input w-full px-3 py-2 h-32 resize-none text-black"
            />
            <button
              onClick={handlePasteSubmit}
              disabled={!pasteText.trim()}
              className="retro-btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ➕ Add Pokemon!!
            </button>
          </div>
        )}

        {/* Error Banner for Invalid Pokemon Names */}
        {invalidNames.length > 0 && (
          <div className="bg-red-200 border-4 border-red-600 p-3 shadow-[4px_4px_0_#000]">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⚠️</span>
                  <span className="font-bold text-red-800 text-lg">
                    ERROR!! Pokemon Not Found!!
                  </span>
                  <span className="text-2xl">⚠️</span>
                </div>
                <p className="text-red-700 text-sm mb-2">
                  The following names could not be matched to any Pokemon:
                </p>
                <div className="flex flex-wrap gap-1">
                  {invalidNames.map((name, index) => (
                    <span
                      key={index}
                      className="bg-red-100 border border-red-500 px-2 py-0.5 text-red-800 text-sm font-bold"
                    >
                      "{name}"
                    </span>
                  ))}
                </div>
                <p className="text-red-600 text-xs mt-2 italic">
                  💡 Tip: Check spelling or try using the official English Pokemon names!
                </p>
              </div>
              <button
                onClick={dismissError}
                className="retro-btn !bg-red-500 !text-white text-sm cursor-pointer hover:!bg-red-600"
              >
                ✖ Close
              </button>
            </div>
          </div>
        )}

        {selectedPokemon.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-lime-200 border-2 border-lime-500 px-2 py-1">
              <span className="text-sm font-bold text-lime-800">
                🎉 {selectedPokemon.length} Pokemon selected!! 🎉
              </span>
              <button
                onClick={handleClearAll}
                className="text-sm text-red-600 hover:text-red-800 font-bold cursor-pointer underline"
              >
                [Clear All]
              </button>
            </div>
            <div className="flex flex-wrap gap-2 p-2 bg-gradient-to-b from-cyan-100 to-cyan-200 border-2 border-cyan-400">
              {selectedPokemon.map((pokemonName) => {
                const pokemonData = findPokemon(pokemonName);
                return (
                  <span
                    key={pokemonName}
                    className="inline-flex items-center gap-1 pl-1 pr-2 py-1 bg-white border-2 border-fuchsia-500 text-fuchsia-800 text-sm font-bold shadow-[2px_2px_0_#000]"
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
                      className="ml-1 text-red-600 hover:text-red-800 font-bold cursor-pointer"
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

  // Modern theme
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
          >
            Add Pokemon
          </button>
        </div>
      )}

      {/* Error Banner for Invalid Pokemon Names */}
      {invalidNames.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-600 font-semibold">
                  Some Pokemon could not be found
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {invalidNames.map((name, index) => (
                  <span
                    key={index}
                    className="bg-red-100 px-2 py-0.5 text-red-700 text-sm rounded"
                  >
                    {name}
                  </span>
                ))}
              </div>
              <p className="text-red-500 text-xs mt-2">
                Check spelling or try using the official English Pokemon names.
              </p>
            </div>
            <button
              onClick={dismissError}
              className="text-red-400 hover:text-red-600 cursor-pointer"
            >
              ✕
            </button>
          </div>
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
                    ×
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
