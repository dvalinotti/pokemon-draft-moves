import { useState, useEffect, useCallback } from "react";
import { usePokemonData } from "./hooks/usePokemonData";
import { filterPokemonByMoves } from "./utils/moveChecker";
import { PokemonInput } from "./components/PokemonInput";
import { MoveSearch } from "./components/MoveSearch";
import { LogicToggle } from "./components/LogicToggle";
import { ResultsList } from "./components/ResultsList";
import type { SearchLogic, SearchResult } from "./types";

function App() {
  const { allPokemon, allMoves, findPokemon, canLearn } = usePokemonData();

  const [selectedPokemon, setSelectedPokemon] = useState<string[]>([]);
  const [selectedMoves, setSelectedMoves] = useState<string[]>([]);
  const [searchLogic, setSearchLogic] = useState<SearchLogic>("OR");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(async () => {
    if (selectedPokemon.length === 0 || selectedMoves.length === 0) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const searchResults = await filterPokemonByMoves(
        selectedPokemon,
        selectedMoves,
        searchLogic,
        canLearn
      );
      setResults(searchResults);
    } catch (error) {
      console.error("Error performing search:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPokemon, selectedMoves, searchLogic, canLearn]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Pokemon VGC Draft Move Finder</h1>
          <p className="text-blue-100 mt-1">
            Find which of your Pokemon can learn specific moves
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <section className="bg-white rounded-xl shadow-md p-6">
              <PokemonInput
                allPokemon={allPokemon}
                selectedPokemon={selectedPokemon}
                onPokemonChange={setSelectedPokemon}
                findPokemon={findPokemon}
              />
            </section>
          </div>

          <div className="flex flex-col gap-4">
            <section className="bg-white rounded-xl shadow-md p-6">
              <MoveSearch
                allMoves={allMoves}
                selectedMoves={selectedMoves}
                onMovesChange={setSelectedMoves}
              />

              {selectedMoves.length > 1 && (
                <div className="mt-4">
                  <LogicToggle
                    logic={searchLogic}
                    onLogicChange={setSearchLogic}
                    disabled={isLoading}
                  />
                </div>
              )}
            </section>

            <section className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <ResultsList
                results={results}
                selectedMoves={selectedMoves}
                logic={searchLogic}
                isLoading={isLoading}
                hasSearched={hasSearched}
                findPokemon={findPokemon}
              />
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-gray-400 py-4 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>
            Pokemon data provided by{" "}
            <a
              href="https://github.com/pkmn/ps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              @pkmn/dex
            </a>{" "}
            | Generation 9 (Scarlet/Violet)
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
